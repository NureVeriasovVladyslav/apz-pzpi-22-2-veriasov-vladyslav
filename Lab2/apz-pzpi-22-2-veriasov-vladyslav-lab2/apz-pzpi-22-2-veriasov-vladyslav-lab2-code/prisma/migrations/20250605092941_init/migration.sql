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

-- CreateEnum
CREATE TYPE "ZoneType" AS ENUM ('ALLOWED', 'NO_PARKING', 'NO_RIDE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "MaintenanceRecordsType" AS ENUM ('ROUTINE', 'REPAIR', 'BATTERY_REPLACEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "IssueReportsStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

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
    "startLocation" JSONB,
    "endLocation" JSONB,
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
    "amount" DECIMAL(10,2) NOT NULL,
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
    "currentLocation" JSONB,

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

-- CreateTable
CREATE TABLE "ParkingZones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "zoneType" "ZoneType" NOT NULL DEFAULT 'ALLOWED',

    CONSTRAINT "ParkingZones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRecords" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "MaintenanceRecordsType" NOT NULL DEFAULT 'ROUTINE',
    "description" TEXT NOT NULL,
    "technicianId" TEXT,
    "cost" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "MaintenanceRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueReports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "dateReported" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "IssueReportsStatus" NOT NULL DEFAULT 'OPEN',
    "description" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "IssueReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDoc" TEXT,
    "dateVerified" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_rentalId_key" ON "Payment"("rentalId");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerification_userId_key" ON "UserVerification"("userId");

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

-- AddForeignKey
ALTER TABLE "MaintenanceRecords" ADD CONSTRAINT "MaintenanceRecords_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecords" ADD CONSTRAINT "MaintenanceRecords_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueReports" ADD CONSTRAINT "IssueReports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueReports" ADD CONSTRAINT "IssueReports_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
