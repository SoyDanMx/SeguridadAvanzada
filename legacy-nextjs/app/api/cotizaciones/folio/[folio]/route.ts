import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ folio: string }> }
) {
  try {
    const { folio } = await params;
    
    const quote = await prisma.quote.findFirst({
      where: { 
        folio: {
          equals: folio,
          mode: 'insensitive'
        }
      }
    });

    if (!quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: quote }, { status: 200 });

  } catch (error: any) {
    console.error('Error buscando cotización por folio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
