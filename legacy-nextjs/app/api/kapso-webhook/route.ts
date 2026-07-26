import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Leer el payload enviado por el webhook de Kapso
    const payload = await req.json();

    // 2. Validar que sea un evento de inactividad
    if (payload.event !== "whatsapp.conversation.inactive") {
      return NextResponse.json({ message: "Ignored: not an inactive event" }, { status: 200 });
    }

    const conversationId = payload.data?.conversation?.id || payload.conversation_id || payload.data?.id;

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversation ID" }, { status: 400 });
    }

    console.log(`[Kapso Webhook] Inactividad detectada en la conversación: ${conversationId}`);

    // 3. Inyectar el mensaje silencioso al agente usando la API de Kapso
    const KAPSO_API_KEY = process.env.KAPSO_API_KEY;

    if (!KAPSO_API_KEY) {
      console.error("KAPSO_API_KEY no está configurada en las variables de entorno.");
      return NextResponse.json({ error: "Internal Configuration Error" }, { status: 500 });
    }

    /* 
     * NOTA: Aquí inyectamos el mensaje "Trigger de inactividad detectado" al contexto 
     * de la conversación en Kapso llamando a una ejecución asíncrona del flujo para esa conversación
     * o enviando un evento de proyecto dependiendo de la API exacta.
     */
    const response = await fetch(`https://api.kapso.ai/platform/v1/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KAPSO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: "system",
        content: "Trigger de inactividad detectado"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error inyectando el trigger en Kapso:", errorText);
      // Fallback intentando emitir evento de proyecto si la API de messages falla
      await fetch(`https://api.kapso.ai/platform/v1/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KAPSO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "abandoned_cart_trigger",
          conversation_id: conversationId,
          properties: { trigger: "Trigger de inactividad detectado" }
        })
      });
      return NextResponse.json({ error: "Failed to trigger agent via messages API, emitted event fallback." }, { status: response.status });
    }

    return NextResponse.json({ success: true, message: "Agente despertado con éxito" }, { status: 200 });

  } catch (error) {
    console.error("Error procesando el webhook de Kapso:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
