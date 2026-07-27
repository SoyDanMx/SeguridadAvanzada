import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const prisma = new PrismaClient();

export const maxDuration = 60; // Allow Vercel up to 60 seconds

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Fetch quote to get folio for the filename
    const quote = await prisma.quote.findUnique({
      where: { id }
    });

    if (!quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
    }

    const folio = quote.folio;
    const filename = `Cotizacion-${folio}.pdf`;

    // 2. Build the URL to render
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://seguridad-avanzada-iodc.vercel.app";
    const targetUrl = `${baseUrl}/cotizador-rapido/${id}`;

    // 3. Configure Chromium for Vercel Serverless
    const executablePath = await chromium.executablePath();
    const isLocal = !process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_BASE_URL?.includes('vercel.app');
    
    let browser;
    if (isLocal) {
      // Local development usually has Chrome installed
      browser = await puppeteer.launch({
        args: [],
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Mac path
        headless: true
      });
    } else {
      // Production Vercel environment
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: true,
      });
    }

    const page = await browser.newPage();
    
    // Set a desktop viewport so the responsive CSS acts like a desktop
    await page.setViewport({ width: 1200, height: 800 });

    // Navigate to the quote page and wait for it to be fully loaded
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    // 4. Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    await browser.close();

    // 5. Return PDF as downloadable attachment
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error interno generando PDF', details: error.message },
      { status: 500 }
    );
  }
}
