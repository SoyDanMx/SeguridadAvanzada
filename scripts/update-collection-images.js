const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STORE = "q5akvk-19.myshopify.com";

// Configuración de búsqueda estricta utilizando el motor de búsqueda de Shopify
const categoriesConfig = [
  {
    name: "Audio y Video Profesional",
    id: "gid://shopify/Collection/659995132036",
    // Buscar bocinas empotrables de alta fidelidad o bafles profesionales
    searchQuery: "bocina techo OR bafle profesional"
  },
  {
    name: "Automatización e Intrusión",
    id: "gid://shopify/Collection/659995164804",
    // Buscar un sensor de movimiento o contacto
    searchQuery: "sensor movimiento OR contacto magnetico"
  },
  {
    name: "Cableado Estructurado",
    id: "gid://shopify/Collection/659995197572",
    // Buscar específicamente una bobina de cable de red
    searchQuery: "bobina utp cat6 OR bobina cobre"
  },
  {
    name: "Control de Acceso",
    id: "gid://shopify/Collection/659995263108",
    // Buscar una terminal biométrica facial o lector de huellas
    searchQuery: "biometrico facial OR lector de huella OR cerradura magnetica"
  },
  {
    name: "Detección de Fuego",
    id: "gid://shopify/Collection/659995295876",
    // Buscar un detector de humo
    searchQuery: "detector de humo"
  },
  {
    name: "Energía / Herramientas",
    id: "gid://shopify/Collection/659995328644",
    // Buscar un panel solar o banco de baterías
    searchQuery: "panel solar OR bateria de ciclo profundo"
  },
  {
    name: "Redes e IT",
    id: "gid://shopify/Collection/659995361412",
    // Buscar un Access Point inalámbrico corporativo o Router
    searchQuery: "access point OR router ubiquiti"
  },
  {
    name: "Videovigilancia",
    id: "gid://shopify/Collection/659995394180",
    // Buscar una cámara IP tipo domo o tipo bala directamente (evita extensores y adaptadores)
    searchQuery: "camara ip bala OR camara ip domo OR camara bullet OR camara turret"
  }
];

const querySearch = `query searchProducts($query: String!) {
  products(first: 10, query: $query) {
    edges {
      node {
        title
        featuredImage {
          url
        }
      }
    }
  }
}`;

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

const queryFilePath = path.join(__dirname, 'temp_search_query.graphql');
const variablesFilePath = path.join(__dirname, 'temp_search_variables.json');

console.log("🚀 Iniciando búsqueda global de imágenes COHERENTES de catálogo...");
console.log(`Tienda: ${STORE}\n`);

async function run() {
  for (const config of categoriesConfig) {
    console.log(`\n🔍 Buscando producto para la categoría: "${config.name}"...`);
    console.log(`   Termino de búsqueda: "${config.searchQuery}"`);

    // 1. Ejecutar búsqueda en la tienda para obtener un producto coherente
    fs.writeFileSync(queryFilePath, querySearch, 'utf8');
    fs.writeFileSync(variablesFilePath, JSON.stringify({ query: config.searchQuery }), 'utf8');

    const searchCmd = `shopify store execute --store ${STORE} --query-file "${queryFilePath}" --variable-file "${variablesFilePath}" --json`;
    
    let matchedProduct = null;

    try {
      const output = execSync(searchCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
      const result = JSON.parse(output);
      const products = result.products?.edges || [];

      // Encontrar el primer producto de la búsqueda que tenga una imagen válida
      for (const edge of products) {
        const p = edge.node;
        if (p.featuredImage && p.featuredImage.url) {
          matchedProduct = p;
          break;
        }
      }
    } catch (err) {
      console.error(`   ❌ Falló la búsqueda para "${config.name}":`, err.message);
      continue;
    }

    if (!matchedProduct) {
      console.log(`   ⚠️ No se encontró ningún producto representativo para la búsqueda.`);
      console.log("--------------------------------------------------");
      continue;
    }

    console.log(`   🎯 Producto seleccionado: "${matchedProduct.title}"`);
    console.log(`   🖼️ URL de imagen: ${matchedProduct.featuredImage.url.slice(0, 85)}...`);

    // 2. Establecer la foto como portada oficial de la colección
    const updateInput = {
      id: config.id,
      image: {
        src: matchedProduct.featuredImage.url
      }
    };

    fs.writeFileSync(queryFilePath, mutationUpdateCollection, 'utf8');
    fs.writeFileSync(variablesFilePath, JSON.stringify({ input: updateInput }), 'utf8');

    const updateCmd = `shopify store execute --store ${STORE} --allow-mutations --query-file "${queryFilePath}" --variable-file "${variablesFilePath}" --json`;

    try {
      const updateOutput = execSync(updateCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
      const updateResult = JSON.parse(updateOutput);

      if (updateResult.collectionUpdate && updateResult.collectionUpdate.collection) {
        console.log(`   ✅ ¡Éxito! Portada coherente establecida para "${config.name}".`);
      } else if (updateResult.collectionUpdate && updateResult.collectionUpdate.userErrors.length > 0) {
        console.log(`   ❌ Error de Shopify: ${JSON.stringify(updateResult.collectionUpdate.userErrors)}`);
      }
    } catch (err) {
      console.error(`   ❌ Error al actualizar "${config.name}":`, err.message);
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
  
  console.log("\n🎉 ¡Proceso finalizado! Todas las imágenes han sido corregidas con coherencia visual absoluta.");
}

run();
