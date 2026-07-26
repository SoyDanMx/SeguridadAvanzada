const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STORE = "q5akvk-19.myshopify.com";

const query = `query {
  productsCount {
    count
  }
  products(first: 20) {
    edges {
      node {
        title
        variants(first: 1) {
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

const queryFilePath = path.join(__dirname, 'temp_count_query.graphql');
fs.writeFileSync(queryFilePath, query, 'utf8');

const command = `shopify store execute --store ${STORE} --query-file "${queryFilePath}" --json`;

try {
  const output = execSync(command, { encoding: 'utf-8' });
  const data = JSON.parse(output);
  console.log("Total Products Count:", data.productsCount ? data.productsCount.count : "Unknown");
  console.log("Sample SKUs:");
  data.products.edges.forEach(edge => {
    const sku = edge.node.variants.edges[0]?.node?.sku;
    console.log(`- Product: "${edge.node.title}" | SKU: "${sku}"`);
  });
} catch (error) {
  console.error("Error executing query:", error.message);
} finally {
  if (fs.existsSync(queryFilePath)) fs.unlinkSync(queryFilePath);
}
