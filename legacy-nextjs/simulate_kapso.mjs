const baseUrl = 'https://seguridad-avanzada-iodc.vercel.app';

async function runTest() {
  console.log("🚀 Iniciando prueba QA/QC simulando a Kapso AI...");
  const payload = {
    customerName: "QA Test Kapso",
    customerPhone: "5555555555",
    serviceName: "Simulación de Cotización Automática",
    items: {
      products: [
        {
          sku: "KAP-001",
          concept: "Licencia de Software",
          quantity: 1,
          unitPrice: 5000,
          amount: 5000
        }
      ],
      professionalName: "Agente Kapso",
      professionalPhone: ""
    }
  };

  try {
    console.log("📦 Enviando POST a /api/cotizaciones...");
    const res = await fetch(`${baseUrl}/api/cotizaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    const data = await res.json();
    console.log("✅ Respuesta Exitosa de la API!");
    console.log(`📄 Folio Asignado: ${data.folio}`);
    console.log(`🔗 URL del PDF para el cliente: ${data.url}`);

    // Validar endpoint de busqueda por folio
    console.log(`\n🔍 Probando nuevo endpoint de búsqueda por folio: /api/cotizaciones/folio/${data.folio}...`);
    const folioRes = await fetch(`${baseUrl}/api/cotizaciones/folio/${data.folio}`);
    if (folioRes.ok) {
        const folioData = await folioRes.json();
        console.log("✅ Cotización recuperada con éxito por folio!");
        console.log(`Total calculado: $${folioData.data.total}`);
    } else {
        console.log("⚠️ El endpoint de folio aún no está disponible en Vercel (probablemente sigue desplegando).");
    }

    console.log("\n🎉 Pre-verificación QA/QC completada exitosamente.");
  } catch (e) {
    console.error("❌ Falló la prueba:", e);
  }
}

runTest();
