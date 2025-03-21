-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'MODERATOR', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "BatteryType" AS ENUM ('LithiumIon', 'LithiumManganese', 'LeadAcid');

-- CreateEnum
CREATE TYPE "BatteryStatus" AS ENUM ('INUSE', 'NOTINUSE', 'BROKEN', 'CHARGING', 'REPAIR');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('FREE', 'INUSE', 'NOTAVAILABLE', 'BROKEN', 'REPAIR');

-- CreateEnum
CREATE TYPE "PaymentMethodTypes" AS ENUM ('VISA', 'PAYPAL', 'MASTERCARD', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "bonusAccount" TEXT,
    "notification" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "photo" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dateRented" TEXT NOT NULL,
    "dateReturned" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "avgSpeed" DOUBLE PRECISION NOT NULL,
    "maxSpeed" DOUBLE PRECISION NOT NULL,
    "energyConsumed" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentMethod" "PaymentMethodTypes" NOT NULL DEFAULT 'MASTERCARD',
    "amount" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "rentalId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalVehicle" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "rentalId" TEXT NOT NULL,

    CONSTRAINT "RentalVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'FREE',
    "runnedDistance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "releaseDate" TEXT NOT NULL,
    "currentLocation" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battery" (
    "id" TEXT NOT NULL,
    "chargeLevel" DOUBLE PRECISION NOT NULL,
    "status" "BatteryStatus" NOT NULL DEFAULT 'NOTINUSE',
    "condition" TEXT,
    "type" "BatteryType" NOT NULL DEFAULT 'LithiumIon',
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Battery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatteryVehicle" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "batteryId" TEXT NOT NULL,

    CONSTRAINT "BatteryVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_rentalId_key" ON "Payment"("rentalId");

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalVehicle" ADD CONSTRAINT "RentalVehicle_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalVehicle" ADD CONSTRAINT "RentalVehicle_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatteryVehicle" ADD CONSTRAINT "BatteryVehicle_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatteryVehicle" ADD CONSTRAINT "BatteryVehicle_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
