import { Injectable } from '@nestjs/common';
import { UpdateBatteryVehicleDto } from './dtos/update-battery-vehicle.dto';
import { BatteryVehicleDto } from './dtos/battery-vehicle.dto';
import { CreateBatteryVehicleDto } from './dtos/create-battery-vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BatteryVehicleService {
    constructor(private prisma: PrismaService) { }

    async findAllBatteryVehicle(): Promise<BatteryVehicleDto[]> {
        const result = await this.prisma.batteryVehicle.findMany();
        return result;
    }

    async createBatteryVehicle(batteryVehicle: BatteryVehicleDto): Promise<CreateBatteryVehicleDto> {
        const result = await this.prisma.batteryVehicle.create({ data: { ...batteryVehicle } });
        return result;
    }

    async updateBatteryVehicle(batteryVehicle: UpdateBatteryVehicleDto, id: string): Promise<CreateBatteryVehicleDto> {
        const result = await this.prisma.batteryVehicle.update({ data: { ...batteryVehicle }, where: { id: id } });
        return result;
    }

    async deleteBatteryVehicle(id: string): Promise<CreateBatteryVehicleDto> {
        const result = await this.prisma.batteryVehicle.delete({ where: { id: id } });
        return result;
    }
}
