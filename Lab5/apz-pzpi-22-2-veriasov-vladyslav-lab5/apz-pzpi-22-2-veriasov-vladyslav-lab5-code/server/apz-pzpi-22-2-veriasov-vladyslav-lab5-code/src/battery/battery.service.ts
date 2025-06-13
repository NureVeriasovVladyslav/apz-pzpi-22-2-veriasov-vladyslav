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

    async getBatteryEnergyConsumptionPerRental(): Promise<Array<{
        rentalId: string,
        vehicleId: string,
        batteryId: string | null,
        userId: string,
        energyConsumed: number
    }>> {
        // 1. Витягуємо всі RentalVehicle із зв'язаними Rental, Vehicle, BatteryVehicle
        const rentalVehicles = await this.prisma.rentalVehicle.findMany({
            include: {
                rental: {
                    select: {
                        id: true,
                        userId: true,
                        energyConsumed: true,
                    }
                },
                vehicle: {
                    include: {
                        batteryVehicle: {
                            select: {
                                batteryId: true
                            }
                        }
                    }
                }
            }
        });

        // 2. Формуємо масив результатів
        const result = rentalVehicles.map(rv => {
            const batteryId = rv.vehicle?.batteryVehicle?.[0]?.batteryId ?? null;
            return {
                rentalId: rv.rentalId,
                vehicleId: rv.vehicleId,
                batteryId,
                userId: rv.rental?.userId,
                energyConsumed: rv.rental?.energyConsumed
            };
        });
        // console.log('Battery energy consumption per rental:', result);
        // 3. Фільтруємо тільки завершені поїздки з батареєю
        return result.filter(item =>
            item.energyConsumed !== null &&
            !!item.vehicleId &&
            !!item.batteryId &&
            !!item.rentalId &&
            !!item.userId
        );
    }

    async calculateBatteryEfficiency(): Promise<Array<{
        batteryId: string,
        totalEnergyConsumed: number,
        totalDistance: number,
        efficiency: number // Wh/km
    }>> {
        // 1. Витягуємо всі BatteryVehicle (зв’язок батарея ↔ транспорт)
        const batteryVehicles = await this.prisma.batteryVehicle.findMany({
            include: {
                battery: true,
                vehicle: {
                    include: {
                        rentalVehicle: {
                            include: {
                                rental: true,
                            }
                        }
                    }
                }
            }
        });

        // 2. Групуємо по batteryId
        const batteryStats: Record<string, { energy: number, distance: number }> = {};

        for (const bv of batteryVehicles) {
            const batteryId = bv.batteryId;
            if (!batteryStats[batteryId]) {
                batteryStats[batteryId] = { energy: 0, distance: 0 };
            }

            // Для кожного транспорту, де була ця батарея, беремо всі поїздки
            const rentals = bv.vehicle?.rentalVehicle?.map(rv => rv.rental).filter(r => r && r.energyConsumed && r.distance) || [];
            for (const rental of rentals) {
                batteryStats[batteryId].energy += Number(rental.energyConsumed) || 0;
                batteryStats[batteryId].distance += Number(rental.distance) || 0;
            }
        }

        // 3. Формуємо результат
        return Object.entries(batteryStats).map(([batteryId, stats]) => ({
            batteryId,
            totalEnergyConsumed: Number(stats.energy.toFixed(2)),
            totalDistance: Number(stats.distance.toFixed(2)),
            efficiency: stats.distance > 0 ? Number((stats.energy / stats.distance).toFixed(3)) : null // Wh/km
        }));
    }

}
