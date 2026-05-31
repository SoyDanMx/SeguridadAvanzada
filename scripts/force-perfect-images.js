const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STORE = "q5akvk-19.myshopify.com";

// Selección manual estricta de las imágenes más icónicas y coherentes del catálogo de la tienda
const perfectCategories = [
  {
    name: "Videovigilancia",
    id: "gid://shopify/Collection/659995394180",
    productName: "Cámara Bala Exterior 4G",
    imageUrl: "https://cdn.shopify.com/s/files/1/1009/8032/6532/files/CSH5_3MP_4G-h.png?v=1779658154"
  },
  {
    name: "Cableado Estructurado",
    id: "gid://shopify/Collection/659995197572",
    productName: "Bobina de Cable UTP Cat6 305m",
    imageUrl: "https://cdn.shopify.com/s/files/1/1009/8032/6532/files/633011061000.jpg?v=1779658609"
  },
  {
    name: "Control de Acceso",
    id: "gid://shopify/Collection/659995263108",
    productName: "Terminal de Reconocimiento Facial DSK5671",
    imageUrl: "https://cdn.shopify.com/s/files/1/1009/8032/6532/files/DSK5671ZV-h.png?v=1779665306"
  },
  {
    name: "Detección de Fuego",
    id: "gid://shopify/Collection/659995295876",
    productName: "Estación de Alarma de Incendio Roja con Tirón",
    imageUrl: "https://cdn.shopify.com/s/files/1/1009/8032/6532/files/HUBXAL458-h.png?v=1779671140"
  },
  {
    name: "Redes e IT",
    id: "gid://shopify/Collection/659995361412",
    productName: "Access Point UniFi Enterprise WiFi 7",
    imageUrl: "https://cdn.shopify.com/s/files/1/1009/8032/6532/files/portada_0S2000_06ffb658-f6b3-4fdb-9358-86d112d73c88.png?v=1779674601"
  },
  {
    name: "Audio y Video Profesional",
    id: "gid://shopify/Collection/659995132036",
    productName: "Altavoz de Techo Blanco",
    imageUrl: "https://cdn.shopify.com/s/files/1/1009/8032/6532/files/DSQAZ0610G1-h.png?v=1779657532"
  },
  {
    name: "Automatización e Intrusión",
    id: "gid://shopify/Collection/659995164804",
    productName: "Kit de Sensores y Contactos de Alarma",
    imageUrl: "https://cdn.shopify.com/s/files/1/1009/8032/6532/files/KITRFSFIREDSC1-h.png?v=1779657549"
  },
  {
    name: "Energía / Herramientas",
    id: "gid://shopify/Collection/659995328644",
    productName: "Remolque con Mástil para Energía Solar",
    imageUrl: "https://cdn.shopify.com/s/files/1/1009/8032/6532/files/PSTVTS3P-h.png?v=1779851268"
  }
];

const mutationUpdateCollection = `mutation collectionUpdate($input: CollectionInput!) {
  collectionUpdate(input: $input) {
    collection {
      id
      title
      image {
        url
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

const queryFilePath = path.join(__dirname, 'temp_force_query.graphql');
const variablesFilePath = path.join(__dirname, 'temp_force_variables.json');

console.log("🚀 Iniciando asignación manual de portadas perfectas...");
console.log(`Tienda: ${STORE}\n`);

// Guardar la mutación en un archivo temporal
fs.writeFileSync(queryFilePath, mutationUpdateCollection, 'utf8');

for (const config of perfectCategories) {
  console.log(`⏳ Forzando imagen icónica para: "${config.name}"...`);
  console.log(`   📦 Representativo: "${config.productName}"`);

  // Crear variables
  const variables = {
    input: {
      id: config.id,
      image: {
        src: config.imageUrl
      }
    }
  };

  // Guardar variables en archivo JSON temporal
  fs.writeFileSync(variablesFilePath, JSON.stringify(variables, null, 2), 'utf8');

  // Ejecutar mutación
  const command = `shopify store execute --store ${STORE} --allow-mutations --query-file "${queryFilePath}" --variable-file "${variablesFilePath}" --json`;

  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    const result = JSON.parse(output);

    if (result.collectionUpdate && result.collectionUpdate.collection) {
      console.log(`   ✅ ¡Establecido! Portada oficial cambiada con éxito.`);
    } else if (result.collectionUpdate && updateResult.collectionUpdate.userErrors.length > 0) {
      console.log(`   ❌ Error de Shopify: ${JSON.stringify(result.collectionUpdate.userErrors)}`);
    } else {
      console.log(`   ⚠️ Respuesta inesperada: ${output}`);
    }
  } catch (error) {
    console.error(`   ❌ Falló la asignación para "${config.name}":`, error.message);
  }

  console.log("--------------------------------------------------");
}

// Limpiar archivos temporales
try {
  if (fs.existsSync(queryFilePath)) fs.unlinkSync(queryFilePath);
  if (fs.existsSync(variablesFilePath)) fs.unlinkSync(variablesFilePath);
} catch (cleanupError) {
  // ignorar
}

console.log("\n🎉 ¡Proceso finalizado! Todas las portadas ahora muestran los productos más icónicos y coherentes.");
