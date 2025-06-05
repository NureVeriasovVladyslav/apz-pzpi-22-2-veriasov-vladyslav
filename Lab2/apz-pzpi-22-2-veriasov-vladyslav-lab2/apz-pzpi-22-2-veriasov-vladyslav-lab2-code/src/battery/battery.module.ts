import { Module } from '@nestjs/common';
import { BatteryController } from './battery.controller';
import { BatteryService } from './battery.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [BatteryController],
  providers: [BatteryService, PrismaService]
})
export class BatteryModule {}
