/*
  Warnings:

  - Changed the type of `wbAccessToken` on the `Barbershop` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `wbPhoneNumberId` on the `Barbershop` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `wbAccountId` on the `Barbershop` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Barbershop" DROP COLUMN "wbAccessToken",
ADD COLUMN     "wbAccessToken" INTEGER NOT NULL,
DROP COLUMN "wbPhoneNumberId",
ADD COLUMN     "wbPhoneNumberId" INTEGER NOT NULL,
DROP COLUMN "wbAccountId",
ADD COLUMN     "wbAccountId" INTEGER NOT NULL;
