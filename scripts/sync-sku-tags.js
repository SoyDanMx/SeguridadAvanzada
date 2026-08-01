const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STORE = "q5akvk-19.myshopify.com";

// Check if we are running in dry-run mode (default is true for safety)
const DRY_RUN = process.argv.includes('--run') ? false : true;

const queryFilePath = path.join(__dirname, 'temp_sync_query.graphql');
const variablesFilePath = path.join(__dirname, 'temp_sync_variables.json');

const query = `query($cursor: String) {
  products(first: 250, after: $cursor) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        title
        tags
        variants(first: 50) {
          edges {
            node {
              sku
            }
          }
        }
      }
    }
  }
}`;

const tagMutation = `mutation tagsAdd($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) {
    node {
      id
    }
    userErrors {
      field
      message
    }
  }
}`;

fs.writeFileSync(queryFilePath, query, 'utf8');

async function run() {
  console.log(`🚀 Iniciando sincronización de tags de SKU en la tienda: ${STORE}`);
  console.log(`Modo: ${DRY_RUN ? 'SIMULACIÓN (Dry Run)' : 'REAL (Cambios activos)'}`);
  console.log("--------------------------------------------------\n");

  let hasNextPage = true;
  let cursor = null;
  let processedCount = 0;
  let matchCount = 0;
  let updateCount = 0;

  while (hasNextPage) {
    const variables = { cursor };
    fs.writeFileSync(variablesFilePath, JSON.stringify(variables), 'utf8');

    const command = `shopify store execute --store ${STORE} --query-file "${queryFilePath}" --variable-file "${variablesFilePath}" --json`;
    
    let result;
    try {
      const output = execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
      result = JSON.parse(output);
    } catch (err) {
      console.error("❌ Error ejecutando consulta de paginación:", err.message);
      break;
    }

    if (!result || !result.products) {
      console.error("❌ Respuesta inesperada de Shopify:", result);
      break;
    }

    const products = result.products.edges;
    processedCount += products.length;

    for (const edge of products) {
      const product = edge.node;
      const id = product.id;
      const title = product.title;
      const existingTags = product.tags.map(t => t.toLowerCase());

      const newTagsToAdd = [];
      const variants = product.variants.edges;

      for (const varEdge of variants) {
        const sku = varEdge.node.sku;
        if (!sku || sku.trim().length < 2) continue;

        const trimmedSku = sku.trim();
        const cleanSku = trimmedSku.replace(/[-/]/g, '');

        // 1. Añadir SKU exacto si no está presente en tags
        if (!existingTags.includes(trimmedSku.toLowerCase()) && !newTagsToAdd.includes(trimmedSku)) {
          newTagsToAdd.push(trimmedSku);
        }

        // 2. Añadir SKU limpio (sin guiones/diagonales) si difiere y no está en tags
        if (cleanSku !== trimmedSku && cleanSku.length > 2) {
          if (!existingTags.includes(cleanSku.toLowerCase()) && !newTagsToAdd.includes(cleanSku)) {
            newTagsToAdd.push(cleanSku);
          }
        }
      }

      if (newTagsToAdd.length > 0) {
        matchCount++;
        console.log(`🔍 [${matchCount}] Encontrado: "${title}"`);
        console.log(`   - SKUs originales: ${variants.map(v => v.node.sku).filter(Boolean).join(', ')}`);
        console.log(`   - Tags a añadir: ${newTagsToAdd.join(', ')}`);

        if (!DRY_RUN) {
          // Escribir mutación y variables para actualización
          const mutQueryFile = path.join(__dirname, 'temp_mut_query.graphql');
          const mutVarFile = path.join(__dirname, 'temp_mut_variables.json');

          fs.writeFileSync(mutQueryFile, tagMutation, 'utf8');
          fs.writeFileSync(mutVarFile, JSON.stringify({ id, tags: newTagsToAdd }), 'utf8');

          const mutCommand = `shopify store execute --store ${STORE} --allow-mutations --query-file "${mutQueryFile}" --variable-file "${mutVarFile}" --json`;
          
          try {
            const mutOutput = execSync(mutCommand, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
            const mutResult = JSON.parse(mutOutput);
            if (mutResult.tagsAdd && mutResult.tagsAdd.userErrors.length === 0) {
              console.log(`   ✅ Tags agregados con éxito.`);
              updateCount++;
            } else {
              console.error(`   ❌ Error de usuario:`, mutResult.tagsAdd.userErrors);
            }
          } catch (mutErr) {
            console.error(`   ❌ Error al ejecutar mutación de tag:`, mutErr.message);
          } finally {
            if (fs.existsSync(mutQueryFile)) fs.unlinkSync(mutQueryFile);
            if (fs.existsSync(mutVarFile)) fs.unlinkSync(mutVarFile);
          }
        }
      }
    }

    hasNextPage = result.products.pageInfo.hasNextPage;
    cursor = result.products.pageInfo.endCursor;
    console.log(`⏳ Progreso: ${processedCount} productos procesados...`);
  }

  // Limpieza final
  if (fs.existsSync(queryFilePath)) fs.unlinkSync(queryFilePath);
  if (fs.existsSync(variablesFilePath)) fs.unlinkSync(variablesFilePath);

  console.log("\n--------------------------------------------------");
  console.log("📊 RESUMEN FINAL:");
  console.log(`- Total productos revisados: ${processedCount}`);
  console.log(`- Productos con SKU con guión que necesitan tag: ${matchCount}`);
  console.log(`- Productos actualizados en vivo: ${updateCount}`);
  console.log("🎉 Proceso finalizado.");
}

run();
