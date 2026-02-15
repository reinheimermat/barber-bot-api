/*
  Warnings:

  - You are about to drop the `Unavailability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Unavailability";

-- CreateTable
CREATE TABLE "UnavailabilityAppointments" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "barberId" TEXT,

    CONSTRAINT "UnavailabilityAppointments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UnavailabilityAppointments" ADD CONSTRAINT "UnavailabilityAppointments_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
