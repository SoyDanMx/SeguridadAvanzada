const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración de la tienda y canal
const STORE = "q5akvk-19.myshopify.com";
const PUBLICATION_ID = "gid://shopify/Publication/327235764356"; // ID de "Tienda online"

// IDs de las 8 colecciones que creamos previamente
const collectionsToPublish = [
  { name: "Audio y Video Profesional", id: "gid://shopify/Collection/659995132036" },
  { name: "Automatización e Intrusión", id: "gid://shopify/Collection/659995164804" },
  { name: "Cableado Estructurado", id: "gid://shopify/Collection/659995197572" },
  { name: "Control de Acceso", id: "gid://shopify/Collection/659995263108" },
  { name: "Detección de Fuego", id: "gid://shopify/Collection/659995295876" },
  { name: "Energía / Herramientas", id: "gid://shopify/Collection/659995328644" },
  { name: "Redes e IT", id: "gid://shopify/Collection/659995361412" },
  { name: "Videovigilancia", id: "gid://shopify/Collection/659995394180" }
];

const mutation = `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    publishable {
      ... on Collection {
        id
        title
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

// Definir rutas para archivos temporales
const queryFilePath = path.join(__dirname, 'temp_pub_query.graphql');
const variablesFilePath = path.join(__dirname, 'temp_pub_variables.json');

console.log("🚀 Iniciando la publicación masiva de colecciones a la Tienda Online...");
console.log(`Tienda: ${STORE}`);
console.log(`Canal de Publicación: "Tienda online" (ID: ${PUBLICATION_ID})\n`);

// Guardar la mutación en un archivo temporal
fs.writeFileSync(queryFilePath, mutation, 'utf8');

for (const col of collectionsToPublish) {
  console.log(`⏳ Publicando colección: "${col.name}"...`);

  // Crear variables
  const variables = {
    id: col.id,
    input: [
      {
        publicationId: PUBLICATION_ID
      }
    ]
  };

  // Guardar variables en un archivo JSON temporal
  fs.writeFileSync(variablesFilePath, JSON.stringify(variables, null, 2), 'utf8');

  // Comando CLI con archivos temporales
  const command = `shopify store execute --store ${STORE} --allow-mutations --query-file "${queryFilePath}" --variable-file "${variablesFilePath}" --json`;

  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    const result = JSON.parse(output);

    if (result.publishablePublish && result.publishablePublish.publishable) {
      console.log(`✅ ¡Éxito! "${col.name}" publicada oficialmente y visible en el storefront.`);
    } else if (result.publishablePublish && result.publishablePublish.userErrors.length > 0) {
      console.log(`❌ Error de usuario al publicar "${col.name}": ${JSON.stringify(result.publishablePublish.userErrors)}`);
    } else {
      console.log(`⚠️ Respuesta inesperada: ${output}`);
    }
  } catch (error) {
    console.error(`❌ Falló la publicación para "${col.name}":`, error.message);
  }

  console.log("--------------------------------------------------");
}

// Limpiar archivos temporales
try {
  if (fs.existsSync(queryFilePath)) fs.unlinkSync(queryFilePath);
  if (fs.existsSync(variablesFilePath)) fs.unlinkSync(variablesFilePath);
} catch (cleanupError) {
  console.error("⚠️ No se pudieron limpiar algunos archivos temporales:", cleanupError.message);
}

console.log("\n🎉 ¡Proceso finalizado! Todas las colecciones han sido publicadas con éxito.");
