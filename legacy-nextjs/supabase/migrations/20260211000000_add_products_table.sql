-- Tabla Product para sincronización Syscom
-- Ejecutar en Supabase: SQL Editor → New Query

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price_usd" DOUBLE PRECISION NOT NULL,
  "price_mxn" DOUBLE PRECISION NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "brand" TEXT,
  "image_url" TEXT,
  "category" TEXT,
  "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Product_sku_key" ON "Product"("sku");
CREATE INDEX IF NOT EXISTS "Product_sku_idx" ON "Product"("sku");
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");
