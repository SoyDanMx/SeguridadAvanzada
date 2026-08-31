import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatPhoneE164(phone: string): string {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("521") && digits.length === 13) {
    return `+52${digits.slice(3)}`;
  }
  return digits.startsWith("52") ? `+${digits}` : `+52${digits}`;
}

export async function GET(req: Request) {
  try {
    // 1. Validar autenticación de Cron (Vercel Cron Secret)
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get("authorization");
    const secret = searchParams.get("secret");
    const expectedSecret = process.env.CRON_SECRET || "45800443387d2d47ab3e0fcf1501ddafe4b1b0e5e7d282daa52e0d93fa3c4f93";

    if (secret !== expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
    }

    // 2. Buscar cotizaciones pendientes creadas entre 15 minutos y 24 horas atrás
    const now = new Date();
    const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const pendingQuotes = await prisma.quote.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          gte: twentyFourHoursAgo,
          lte: fifteenMinsAgo,
        },
        customerPhone: {
          not: null,
        },
      },
      take: 10,
    });

    console.log(`[Vendedor Persistente Cron] Encontradas ${pendingQuotes.length} cotización(es) pendientes para seguimiento.`);

    const kapsoApiKey = process.env.KAPSO_API_KEY || "640d59aeeca28171f910da5d408d0a8c588e5b0db572d3e42f50087746b70a2e";
    const kapsoPhoneId = process.env.KAPSO_PHONE_NUMBER_ID;

    const results = [];

    for (const quote of pendingQuotes) {
      if (!quote.customerPhone) continue;

      const formattedPhone = formatPhoneE164(quote.customerPhone);
      const followUpText = `Hola, ${quote.customerName}. Retomo nuestro chat brevemente para saber si pudiste visualizar tu cotización formal (${quote.folio}). ¿Tienes alguna duda con las especificaciones o prefieres que te apoyemos con los datos de pago para apartar tu equipo? 📄📦`;

      let sentSuccess = false;

      // Si se cuenta con KAPSO_PHONE_NUMBER_ID, enviar por la API oficial de WhatsApp
      if (kapsoPhoneId) {
        try {
          const res = await fetch(`https://api.kapso.ai/meta/whatsapp/v20.0/${kapsoPhoneId}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": kapsoApiKey,
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: formattedPhone,
              type: "text",
              text: { body: followUpText },
            }),
          });

          sentSuccess = res.ok;
        } catch (e: any) {
          console.error(`[Vendedor Persistente] Error enviando mensaje a ${formattedPhone}:`, e);
        }
      }

      // Marcar la cotización como FOLLOWED_UP para evitar duplicados
      await prisma.quote.update({
        where: { id: quote.id },
        data: { status: "FOLLOWED_UP" },
      });

      results.push({
        folio: quote.folio,
        customerName: quote.customerName,
        phone: formattedPhone,
        sent: sentSuccess,
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error en cron de vendedor persistente:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
