import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Force Next.js to reload the new Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { customerName, customerPhone, serviceName, items, subtotal, tax, total } = payload;

    if (!customerName || !items || !total) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
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

    // Construir la URL pública que el agente enviará al cliente
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const quoteUrl = `${baseUrl}/cotizador-rapido/${quote.id}`;

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
