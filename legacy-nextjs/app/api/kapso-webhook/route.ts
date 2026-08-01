import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Leer el payload enviado por el webhook de Kapso
    const payload = await req.json();
    console.log("[Kapso Webhook] Recibido payload:", JSON.stringify(payload));

    // 2. Normalizar payload (puede ser objeto o array de eventos)
    const eventData = Array.isArray(payload) ? payload[0] : payload;
    const eventType = eventData?.event || eventData?.type || eventData?.event_type || eventData?.data?.event || "";
    const normalizedEvent = typeof eventType === "string" ? eventType.toLowerCase().trim() : "";
    
    // Fallback flexible: acepta términos en inglés ("inactive") y español ("inactividad", "inactiv"), así como idle, timeout, abandoned, etc.
    const payloadStr = JSON.stringify(payload).toLowerCase();
    const isInactiveEvent = 
      normalizedEvent.includes("inactiv") || 
      normalizedEvent.includes("idle") || 
      normalizedEvent.includes("timeout") || 
      normalizedEvent.includes("abandoned") || 
      normalizedEvent.includes("followup") || 
      normalizedEvent.includes("vendedor") || 
      payloadStr.includes("inactiv") || 
      payloadStr.includes("conversation.inactive") || 
      payloadStr.includes("whatsapp.conversation.inactive") ||
      payloadStr.includes("conversation_inactive") ||
      payloadStr.includes("conversation inactive") ||
      payloadStr.includes("inactividad_detectada") ||
      payloadStr.includes("trigger_inactividad") ||
      normalizedEvent === "" || 
      normalizedEvent === "trigger" || 
      normalizedEvent === "webhook";

    if (!isInactiveEvent) {
      console.log(`[Kapso Webhook] Evento ignorado (tipo detectado: "${eventType}"). Payload: ${JSON.stringify(payload).substring(0, 100)}`);
      return NextResponse.json({ message: `Ignored: not an inactive event` }, { status: 200 });
    }

    // Función recursiva segura para buscar el conversation_id en cualquier parte del payload
    const findConversationId = (obj: any): string | undefined => {
      if (!obj || typeof obj !== 'object') return undefined;
      if (typeof obj.conversation_id === 'string' && obj.conversation_id) return obj.conversation_id;
      if (typeof obj.conversationId === 'string' && obj.conversationId) return obj.conversationId;
      if (typeof obj.conversation_ID === 'string' && obj.conversation_ID) return obj.conversation_ID;
      if (typeof obj.conversation === 'string' && obj.conversation) return obj.conversation;
      if (obj.conversation && typeof obj.conversation === 'object' && typeof obj.conversation.id === 'string') return obj.conversation.id;
      if (typeof obj.id === 'string' && (obj.id.startsWith('conv_') || obj.id.includes('-') || obj.id.length > 5)) return obj.id;

      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const found = findConversationId(obj[key]);
          if (found) return found;
        }
      }
      return undefined;
    };

    const conversationId = findConversationId(eventData);

    if (!conversationId) {
      console.error("[Kapso Webhook] Error: No se encontró conversation ID en el payload completo:", JSON.stringify(payload));
      return NextResponse.json({ error: "Missing conversation ID" }, { status: 400 });
    }

    console.log(`[Kapso Webhook] Inactividad detectada en la conversación: ${conversationId}`);

    // 3. Inyectar el mensaje silencioso al agente usando la API de Kapso
    const KAPSO_API_KEY = process.env.KAPSO_API_KEY || "715d809b3f1409b3523739545729b98b1e1a08fc2f3c57dd5d92cb191a474884";

    if (!KAPSO_API_KEY) {
      console.error("KAPSO_API_KEY no está configurada en las variables de entorno.");
      return NextResponse.json({ error: "Internal Configuration Error" }, { status: 500 });
    }

    const kapsoHeaders = {
      'Authorization': `Bearer ${KAPSO_API_KEY}`,
      'X-API-Key': KAPSO_API_KEY,
      'Content-Type': 'application/json'
    };

    /* 
     * Inyectamos el evento de inactividad a la API oficial de eventos de Kapso.
     * Kapso exige que el campo 'name' tenga formato 'lowercase dotted snake_case' (ej: 'conversation.inactive').
     */
    let response = await fetch(`https://api.kapso.ai/platform/v1/events`, {
      method: 'POST',
      headers: kapsoHeaders,
      body: JSON.stringify({
        name: "conversation.inactive",
        conversation_id: conversationId,
        properties: {
          trigger: "Trigger de inactividad detectado",
          source: "kapso-webhook",
          event: "inactivity"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Kapso Webhook] Falló evento conversation.inactive (${response.status}): ${errorText}. Intentando con inactivity.detected...`);
      
      response = await fetch(`https://api.kapso.ai/platform/v1/events`, {
        method: 'POST',
        headers: kapsoHeaders,
        body: JSON.stringify({
          name: "inactivity.detected",
          conversation_id: conversationId,
          properties: {
            trigger: "Trigger de inactividad detectado",
            source: "kapso-webhook"
          }
        })
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Kapso Webhook] Error emitiendo evento de inactividad a Kapso:", errorText);
      return NextResponse.json({ error: "Failed to trigger inactivity event in Kapso", details: errorText }, { status: response.status });
    }

    const resData = await response.json().catch(() => ({}));
    console.log(`[Kapso Webhook] Agente despertado con éxito para conversación ${conversationId}`);
    return NextResponse.json({ success: true, message: "Agente despertado con éxito", data: resData }, { status: 200 });

  } catch (error: any) {
    console.error("Error procesando el webhook de Kapso:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error?.message }, { status: 500 });
  }
}

