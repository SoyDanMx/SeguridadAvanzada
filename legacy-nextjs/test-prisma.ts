import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function test() {
  const query = "TL-WA850RE";
  try {
    const exactMatch = await prisma.product.findUnique({
      where: { sku: query }
    });
    console.log("Exact match:", exactMatch);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}
test();
