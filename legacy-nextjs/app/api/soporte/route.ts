import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Falta OPENAI_API_KEY" }, { status: 500 });
    }

    const { question, sku } = await req.json();
    if (!question) return NextResponse.json({ error: "Falta la pregunta (question)" }, { status: 400 });

    console.log(`[RAG Support] Pregunta: "${question}" (SKU: ${sku || 'Ninguno'})`);

    // 1. Obtener Embedding de la pregunta
    const embRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const queryVector = embRes.data[0].embedding;
    const vectorStr = `[${queryVector.join(',')}]`;

    // 2. Buscar similitud en Postgres usando el RPC que creamos
    // Pasamos el vector de la pregunta, un threshold (0.5), y un max_count (5)
    let matchQuery = `
      SELECT id, content, metadata, similarity
      FROM match_documents('${vectorStr}'::vector, 0.4, 5)
    `;

    // Si se provee un SKU, idealmente filtraríamos por metadata->>'sku', pero por ahora 
    // la búsqueda de similitud semántica traerá el manual correcto casi siempre.
    const matches: any[] = await prisma.$queryRawUnsafe(matchQuery);

    if (!matches || matches.length === 0) {
      return NextResponse.json({ 
        answer: "Lo siento, no encontré información técnica en los manuales sobre esa pregunta. Por favor, contacta a nuestro equipo de soporte humano." 
      });
    }

    // 3. Preparar el contexto para la IA
    const contextText = matches.map(m => `Fragmento (SKU: ${m.metadata?.sku || 'Desconocido'}): ${m.content}`).join("\n\n");

    const systemPrompt = `Eres un experto Ingeniero de Soporte Técnico de Seguridad Avanzada. 
Responde la pregunta del cliente de forma clara, profesional y paso a paso. 
Utiliza ÚNICAMENTE la siguiente información técnica extraída de los manuales oficiales de los equipos. 
Si la información no es suficiente para responder con certeza, indícalo. NO inventes pasos técnicos.

CONTEXTO TÉCNICO:
${contextText}
`;

    // 4. Generar respuesta con OpenAI (GPT-4o o GPT-4-turbo)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Rápido y barato
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.2, // Respuestas precisas, no creativas
    });

    const answer = completion.choices[0].message.content;

    return NextResponse.json({ 
      answer,
      context_used: matches.length
    });

  } catch (error: any) {
    console.error("[RAG Support Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
