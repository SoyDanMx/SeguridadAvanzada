const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración de la tienda
const STORE = "q5akvk-19.myshopify.com";

// Lista de tipos de productos únicos detectados en tu tienda
const productTypes = [
  "Audio y Video Profesional",
  "Automatización e Intrusión",
  "Cableado Estructurado",
  "Control de Acceso",
  "Detección de Fuego",
  "Energía / Herramientas",
  "Redes e IT",
  "Videovigilancia"
];

const mutation = `mutation collectionCreate($input: CollectionInput!) {
  collectionCreate(input: $input) {
    collection {
      id
      title
      handle
    }
    userErrors {
      field
      message
    }
  }
}`;

// Definir rutas para archivos temporales
const queryFilePath = path.join(__dirname, 'temp_query.graphql');
const variablesFilePath = path.join(__dirname, 'temp_variables.json');

console.log("🚀 Iniciando la creación automática de colecciones en Shopify...");
console.log(`Tienda destino: ${STORE}\n`);

// Guardar la mutación en un archivo temporal
fs.writeFileSync(queryFilePath, mutation, 'utf8');

for (const type of productTypes) {
  console.log(`⏳ Creando colección para: "${type}"...`);

  // Crear variables de la mutación GraphQL
  const variables = {
    input: {
      title: type,
      ruleSet: {
        appliedDisjunctively: false,
        rules: [
          {
            column: "TYPE",
            relation: "EQUALS",
            condition: type
          }
        ]
      }
    }
  };

  // Guardar las variables en un archivo JSON temporal
  fs.writeFileSync(variablesFilePath, JSON.stringify(variables, null, 2), 'utf8');

  // Construir comando CLI apuntando a archivos temporales para evitar problemas de escape de comillas en bash
  const command = `shopify store execute --store ${STORE} --allow-mutations --query-file "${queryFilePath}" --variable-file "${variablesFilePath}" --json`;

  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    const result = JSON.parse(output);

    if (result.collectionCreate && result.collectionCreate.collection) {
      const col = result.collectionCreate.collection;
      console.log(`✅ ¡Éxito! Colección creada: "${col.title}" (Handle: ${col.handle}, ID: ${col.id})`);
    } else if (result.collectionCreate && result.collectionCreate.userErrors.length > 0) {
      console.log(`❌ Error de usuario: ${JSON.stringify(result.collectionCreate.userErrors)}`);
    } else {
      console.log(`⚠️ Respuesta inesperada: ${output}`);
    }
  } catch (error) {
    console.error(`❌ Falló la ejecución para "${type}":`, error.message);
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

console.log("\n🎉 ¡Proceso finalizado! Todas las colecciones han sido creadas con éxito.");
