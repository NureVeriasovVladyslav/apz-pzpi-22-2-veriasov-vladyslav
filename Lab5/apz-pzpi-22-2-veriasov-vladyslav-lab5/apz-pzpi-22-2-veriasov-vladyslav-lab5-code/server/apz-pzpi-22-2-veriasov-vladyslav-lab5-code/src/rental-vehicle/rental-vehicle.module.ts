import { Module } from '@nestjs/common';
import { RentalVehicleController } from './rental-vehicle.controller';
import { RentalVehicleService } from './rental-vehicle.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [RentalVehicleController],
  providers: [RentalVehicleService, PrismaService]
})
export class RentalVehicleModule {}
