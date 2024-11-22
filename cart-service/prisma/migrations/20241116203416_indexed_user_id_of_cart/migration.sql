-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "total" SET DEFAULT 0;

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");
