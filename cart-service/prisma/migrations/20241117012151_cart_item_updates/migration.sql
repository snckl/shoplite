/*
  Warnings:

  - Added the required column `description` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUri" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;
