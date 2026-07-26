const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STORE = "q5akvk-19.myshopify.com";
const PRODUCT_ID = "gid://shopify/Product/10339785048196";
const TAG = "MG50431EZ";

const mutation = `mutation tagsAdd($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) {
    node {
      id
      ... on Product {
        title
        tags
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

const queryFilePath = path.join(__dirname, 'temp_tag_query.graphql');
const variablesFilePath = path.join(__dirname, 'temp_tag_variables.json');

fs.writeFileSync(queryFilePath, mutation, 'utf8');
fs.writeFileSync(variablesFilePath, JSON.stringify({ id: PRODUCT_ID, tags: [TAG] }, null, 2), 'utf8');

const command = `shopify store execute --store ${STORE} --allow-mutations --query-file "${queryFilePath}" --variable-file "${variablesFilePath}" --json`;

try {
  console.log(`Adding tag "${TAG}" to product ID ${PRODUCT_ID}...`);
  const output = execSync(command, { encoding: 'utf-8' });
  console.log("Mutation Response:\n", output);
} catch (error) {
  console.error("Error executing mutation:", error.message);
} finally {
  if (fs.existsSync(queryFilePath)) fs.unlinkSync(queryFilePath);
  if (fs.existsSync(variablesFilePath)) fs.unlinkSync(variablesFilePath);
}
