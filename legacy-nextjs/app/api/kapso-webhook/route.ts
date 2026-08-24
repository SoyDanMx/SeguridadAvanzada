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

    // 3. Inyectar el mensaje de inactividad a Kapso usando X-API-Key
    const KAPSO_API_KEY = process.env.KAPSO_API_KEY || "640d59aeeca28171f910da5d408d0a8c588e5b0db572d3e42f50087746b70a2e";

    const kapsoHeaders = {
      'X-API-Key': KAPSO_API_KEY,
      'Content-Type': 'application/json'
    };

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
      console.warn(`[Kapso Webhook] Falló evento conversation.inactive (${response.status}): ${errorText}. Intentando enviar mensaje de seguimiento directo...`);
      
      const phoneId = process.env.KAPSO_PHONE_NUMBER_ID;
      const customerPhone = eventData?.customer_phone || eventData?.phone || eventData?.from;

      if (phoneId && customerPhone) {
        const formattedPhone = String(customerPhone).replace(/\D/g, "");
        response = await fetch(`https://api.kapso.ai/meta/whatsapp/v20.0/${phoneId}/messages`, {
          method: 'POST',
          headers: kapsoHeaders,
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: formattedPhone.startsWith("52") ? `+${formattedPhone}` : `+52${formattedPhone}`,
            type: "text",
            text: { body: "Hola, retomo nuestro chat para saber si pudiste visualizar tu información. ¿Tienes alguna duda o te apoyamos con los datos de pago para apartar tu equipo? 📄📦" }
          })
        });
      }
    }

    const resData = await response.json().catch(() => ({}));
    console.log(`[Kapso Webhook] Proceso de inactividad completado para conversación ${conversationId}`);
    return NextResponse.json({ success: true, message: "Seguimiento de inactividad procesado", data: resData }, { status: 200 });

  } catch (error: any) {
    console.error("Error procesando el webhook de Kapso:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error?.message }, { status: 500 });
  }
}

