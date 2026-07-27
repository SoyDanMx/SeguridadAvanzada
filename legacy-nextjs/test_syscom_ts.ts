import { getProducts } from './lib/syscom-client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const data = await getProducts({ limit: 1 });
  const prod = data.products[0];
  console.log("Keys:", Object.keys(prod));
  console.log("Recursos:", JSON.stringify(prod.recursos, null, 2));
  console.log("Datasheet:", prod.datasheet);
}
main().catch(console.error);
