import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PricingService } from "@/lib/pricing-service";

// Force Next.js to reload the new Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    let { customerName, customerPhone, serviceName, items, subtotal, tax, total } = payload;

    if (!customerName || !items) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Auto-calculate math for Kapso AI integration if totals are 0 or missing
    if (!total || total === 0) {
      if (items.products && Array.isArray(items.products)) {
        // Auto-extract SKU if embedded in concept
        items.products.forEach((p: any) => {
          if (!p.sku && p.concept) {
            const match = p.concept.match(/SKU:\s*([^\)]+)/i);
            if (match) {
              p.sku = match[1].trim();
              p.concept = p.concept.replace(/\s*\(\s*SKU:\s*[^\)]+\s*\)/i, '').trim();
            }
          }
        });

        // Aplicar el PricingService para limpiar precios sucios (ej. "$313.83 MXN") y extraer el IVA
        const cartMath = PricingService.calculateCartTotals(items.products);
        
        items.products = cartMath.items;
        subtotal = cartMath.subtotal;
        tax = cartMath.tax;
        total = cartMath.total;
      }
    }

    // Generar un folio único para Seguridad Avanzada
    const date = new Date();
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
    const folio = `SEG-${date.getFullYear()}-${randomNum}`;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Válida por 7 días

    // Crear la cotización en la base de datos
    const quote = await prisma.quote.create({
      data: {
        folio,
        customerName,
        customerPhone,
        serviceName,
        items,
        subtotal,
        tax,
        total,
        expiresAt
      }
    });

    // Construir la URL pública del PDF que el agente enviará al cliente
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://seguridad-avanzada.vercel.app";
    const quoteUrl = `${baseUrl}/api/cotizaciones/${quote.id}/pdf`;

    return NextResponse.json({ 
      success: true, 
      folio: quote.folio,
      url: quoteUrl 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creando la cotización:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message, stack: error.stack }, { status: 500 });
  }
}
