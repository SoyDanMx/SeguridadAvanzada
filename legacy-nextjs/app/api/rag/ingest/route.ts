import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getProducts } from "@/lib/syscom-client";
import OpenAI from "openai";
const pdf = require("pdf-parse");

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Chunk text into smaller segments for embedding
function chunkText(text: string, chunkSize = 1500, overlap = 200) {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Falta OPENAI_API_KEY en las variables de entorno" }, { status: 500 });
    }

    const { sku } = await req.json();
    if (!sku) return NextResponse.json({ error: "Falta el SKU" }, { status: 400 });

    console.log(`[RAG] Iniciando ingesta para SKU: ${sku}`);

    // 1. Obtener producto de Syscom
    const data = await getProducts({ search: sku, limit: 1 });
    if (!data.products || data.products.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado en Syscom" }, { status: 404 });
    }

    const prod = data.products[0];
    const recursos = prod.recursos as Array<{ recurso: string; path: string }> | undefined;

    if (!recursos || recursos.length === 0) {
      return NextResponse.json({ error: "El producto no tiene manuales ni recursos" }, { status: 404 });
    }

    // Buscar el Manual o Guía
    let manualUrl = recursos.find(r => r.recurso.toLowerCase().includes("manual"))?.path;
    if (!manualUrl) {
      manualUrl = recursos.find(r => r.recurso.toLowerCase().includes("guía") || r.recurso.toLowerCase().includes("guia"))?.path;
    }
    if (!manualUrl) {
      manualUrl = recursos.find(r => r.recurso.toLowerCase().includes("datasheet") || r.recurso.toLowerCase().includes("ficha"))?.path;
    }

    if (!manualUrl) {
      return NextResponse.json({ error: "No se encontró ningún PDF útil para procesar" }, { status: 404 });
    }

    console.log(`[RAG] Descargando PDF: ${manualUrl}`);

    // 2. Descargar y parsear PDF
    const response = await fetch(manualUrl);
    if (!response.ok) throw new Error("Error descargando el PDF desde Syscom");
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const pdfData = await pdf(buffer);
    const text = pdfData.text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

    if (!text || text.length < 50) {
      return NextResponse.json({ error: "No se pudo extraer texto del PDF (probablemente son puras imágenes)" }, { status: 400 });
    }

    // 3. Crear Chunks
    const chunks = chunkText(text, 1500, 200);
    console.log(`[RAG] Generando embeddings para ${chunks.length} chunks...`);

    // 4. Obtener Embeddings de OpenAI y Guardar en PgVector
    let saved = 0;
    for (const chunk of chunks) {
      // Pedir embedding a OpenAI
      const embRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      const vector = embRes.data[0].embedding;

      // Guardar en Supabase usando raw SQL
      // El vector debe ser formateado como cadena '[0.1, 0.2, ...]'
      const vectorStr = `[${vector.join(',')}]`;
      
      const metadata = {
        sku: prod.modelo || sku,
        name: prod.titulo || "",
        source: manualUrl
      };

      await prisma.$executeRawUnsafe(
        `INSERT INTO "RagDocument" (content, metadata, embedding) VALUES ($1, $2::jsonb, $3::vector)`,
        chunk,
        JSON.stringify(metadata),
        vectorStr
      );
      saved++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Se han procesado e ingestado ${saved} fragmentos del producto ${sku}.`
    });

  } catch (error: any) {
    console.error("[RAG Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
