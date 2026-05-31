-- Añade syscom_category_id para filtrar productos por disciplina
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "syscom_category_id" TEXT;
CREATE INDEX IF NOT EXISTS "Product_syscom_category_id_idx" ON "Product"("syscom_category_id");
