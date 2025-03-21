import { Module } from '@nestjs/common';
import { BatteryVehicleController } from './battery-vehicle.controller';
import { BatteryVehicleService } from './battery-vehicle.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [BatteryVehicleController],
  providers: [BatteryVehicleService, PrismaService]
})
export class BatteryVehicleModule {}
