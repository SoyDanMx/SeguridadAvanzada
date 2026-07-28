import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Leer el payload enviado por el webhook de Kapso
    const payload = await req.json();
    console.log("[Kapso Webhook] Recibido payload:", JSON.stringify(payload));

    // 2. Validar que sea un evento de inactividad
    const eventType = payload.event || payload.type || payload.event_type || payload.data?.event;
    const normalizedEvent = typeof eventType === "string" ? eventType.toLowerCase().trim() : "";

    const isInactiveEvent =
      normalizedEvent === "conversation.inactive" ||
      normalizedEvent === "whatsapp.conversation.inactive" ||
      normalizedEvent === "conversation_inactive" ||
      normalizedEvent === "conversation inactive";

    if (!isInactiveEvent) {
      console.log(`[Kapso Webhook] Evento ignorado (tipo recibido: "${eventType}")`);
      return NextResponse.json({ message: `Ignored: event ${eventType} is not an inactive event` }, { status: 200 });
    }

    const conversationId =
      payload.conversation_id ||
      payload.data?.conversation?.id ||
      payload.data?.id ||
      payload.conversation?.id ||
      payload.id;

    if (!conversationId) {
      console.error("[Kapso Webhook] Error: No se encontró conversation ID en el payload");
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
     * Inyectamos el mensaje "Trigger de inactividad detectado" al contexto 
     * de la conversación en Kapso llamando a la API de mensajes.
     */
    let response = await fetch(`https://api.kapso.ai/platform/v1/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KAPSO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: "user",
        content: "Trigger de inactividad detectado"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Kapso Webhook] Falló envío con role='user' (${response.status}): ${errorText}. Reintentando con role='system'...`);
      
      response = await fetch(`https://api.kapso.ai/platform/v1/conversations/${conversationId}/messages`, {
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
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Kapso Webhook] Error inyectando el trigger en Kapso:", errorText);
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
      return NextResponse.json({ error: "Failed to trigger agent via messages API, emitted event fallback.", details: errorText }, { status: response.status });
    }

    const resData = await response.json().catch(() => ({}));
    console.log(`[Kapso Webhook] Agente despertado con éxito para conversación ${conversationId}`);
    return NextResponse.json({ success: true, message: "Agente despertado con éxito", data: resData }, { status: 200 });

  } catch (error: any) {
    console.error("Error procesando el webhook de Kapso:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error?.message }, { status: 500 });
  }
}
