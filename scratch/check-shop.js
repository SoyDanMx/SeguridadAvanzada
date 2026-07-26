const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STORE = "q5akvk-19.myshopify.com";

const query = `query {
  shop {
    name
    myshopifyDomain
    primaryDomain {
      url
      host
    }
  }
}`;

const queryFilePath = path.join(__dirname, 'temp_shop_query.graphql');
fs.writeFileSync(queryFilePath, query, 'utf8');

const command = `shopify store execute --store ${STORE} --query-file "${queryFilePath}" --json`;

try {
  const output = execSync(command, { encoding: 'utf-8' });
  console.log("GraphQL Response:\n", output);
} catch (error) {
  console.error("Error executing query:", error.message);
} finally {
  if (fs.existsSync(queryFilePath)) fs.unlinkSync(queryFilePath);
}
