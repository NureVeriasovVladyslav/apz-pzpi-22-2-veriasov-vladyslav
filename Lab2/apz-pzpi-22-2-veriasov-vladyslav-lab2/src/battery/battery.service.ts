import { Injectable } from '@nestjs/common';
import { BatteryDto } from './dtos/battery.dto';
import { UpdateBatteryDto } from './dtos/update-battery.dto';
import { CreateBatteryDto } from './dtos/create-battery.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BatteryService {
    constructor(private prisma: PrismaService) { }

    async findAllBattery(): Promise<BatteryDto[]> {
        const result = await this.prisma.battery.findMany();
        return result;
    }

    async createBattery(battery: BatteryDto): Promise<CreateBatteryDto> {
        const result = await this.prisma.battery.create({ data: { ...battery } });
        return result;
    }

    async updateBattery(battery: UpdateBatteryDto, id: string): Promise<CreateBatteryDto> {
        const result = await this.prisma.battery.update({ data: { ...battery }, where: { id: id } });
        return result;
    }

    async deleteBattery(id: string): Promise<CreateBatteryDto> {
        const result = await this.prisma.battery.delete({ where: { id: id } });
        return result;
    }
    
    async calculateBatteryStatus(): Promise<{ batteryId: string, status: string }[]> {
        const batteries = await this.prisma.battery.findMany();
        return batteries.map(battery => ({
            batteryId: battery.id,
            status: battery.chargeLevel < 20 ? "LOW" : "NORMAL",
        }));
    }

    async getImplementedBatteryInVehicle(id: string): Promise<CreateBatteryDto[]> {
        const result = await this.prisma.batteryVehicle.findMany({
            where: {
                vehicleId: id,
            },
            include: { battery: true },
        });
        return result.map(({ battery }) => ({
            id: battery.id,
            chargeLevel: battery.chargeLevel,
            status: battery.status,
            condition: battery.condition,
            type: battery.type,
            capacity: battery.capacity,
        }));
    }  
}
