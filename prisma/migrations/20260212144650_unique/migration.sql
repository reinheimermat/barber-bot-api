/*
  Warnings:

  - A unique constraint covering the columns `[wbAccessToken]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wbPhoneNumberId]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wbAccountId]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_wbAccessToken_key" ON "Barbershop"("wbAccessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_wbPhoneNumberId_key" ON "Barbershop"("wbPhoneNumberId");

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_wbAccountId_key" ON "Barbershop"("wbAccountId");
