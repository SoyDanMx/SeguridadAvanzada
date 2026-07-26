import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las cotizaciones
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    
    // Obtener cotizaciones con filtro de búsqueda opcional
    const quotes = await prisma.quote.findMany({
      where: search ? {
        OR: [
          { folio: { contains: search, mode: "insensitive" } },
          { customerName: { contains: search, mode: "insensitive" } },
          { customerPhone: { contains: search, mode: "insensitive" } }
        ]
      } : undefined,
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(quotes);
  } catch (error: any) {
    console.error("Error obteniendo cotizaciones:", error);
    return NextResponse.json({ error: "Error interno", details: error.message }, { status: 500 });
  }
}

// Actualizar el estado de una cotización
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedQuote);
  } catch (error: any) {
    console.error("Error actualizando cotización:", error);
    return NextResponse.json({ error: "Error interno", details: error.message }, { status: 500 });
  }
}
