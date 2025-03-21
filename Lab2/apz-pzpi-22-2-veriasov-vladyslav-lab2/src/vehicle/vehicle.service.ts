import { Injectable } from '@nestjs/common';
import { VehicleDto } from './dtos/vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { VehicleStatus } from '@prisma/client';

@Injectable()
export class VehicleService {
    constructor(private prisma: PrismaService) { }

    async findAllVehicle(): Promise<VehicleDto[]> {
        const result = await this.prisma.vehicle.findMany();
        return result;
    }

    async createVehicle(vehicle: VehicleDto): Promise<CreateVehicleDto> {
        const result = await this.prisma.vehicle.create({ 
            // data: { ...vehicle } 
            data: {
                status: vehicle.status,
                runnedDistance: 0,
                releaseDate: new Date().toISOString(),
                currentLocation: vehicle.currentLocation,
            },
        });
        return result;
    }

    async updateVehicle(vehicle: UpdateVehicleDto, id: string): Promise<CreateVehicleDto> {
        const result = await this.prisma.vehicle.update({ data: { ...vehicle }, where: { id: id } });
        return result;
    }

    async deleteVehicle(id: string): Promise<CreateVehicleDto> {
        const result = await this.prisma.vehicle.delete({ where: { id: id } });
        return result;
    }

    async calculateTotalDistance(vehicleId: string): Promise<number> {

        // Отримуємо всі оренди для вказаного транспортного засобу
        const rentals = await this.prisma.rentalVehicle.findMany({
            where: { vehicleId },
            include: { rental: true },
        });

        // Обчислюємо загальну дистанцію
        const totalDistance = rentals.reduce(
            (total, rentalVehicle) => total + rentalVehicle.rental.distance,
            0,
        );

        // Оновлюємо поле `runnedDistance` у транспортному засобі
        await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: { runnedDistance: totalDistance },
        });

        // Повертаємо обчислену загальну дистанцію
        return totalDistance;
    }

    async getVehicleInfo(vehicleId: string): Promise<VehicleDto> {
        const result = await this.prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });
        return result;
    }

    async calculateAverageSpeed(vehicleId: string): Promise<number> {
        const rentals = await this.prisma.rentalVehicle.findMany({
            where: { vehicleId },
            include: { rental: true },
        });

        const totalSpeed = rentals.reduce((sum, rentalVehicle) => sum + rentalVehicle.rental.avgSpeed, 0);
        return rentals.length > 0 ? totalSpeed / rentals.length : 0;
    }

    async findMostEfficientVehicle(): Promise<{ vehicleId: string, efficiency: number }> {
        const vehicles = await this.prisma.vehicle.findMany({
            include: { rentalVehicle: { include: { rental: true } } },
        });

        const efficiencyData = vehicles.map(vehicle => {
            const totalDistance = vehicle.rentalVehicle.reduce((sum, rv) => sum + rv.rental.distance, 0);
            const totalEnergy = vehicle.rentalVehicle.reduce((sum, rv) => sum + rv.rental.energyConsumed, 0);
            const efficiency = totalDistance > 0 ? totalEnergy / totalDistance : Infinity;
            return { vehicleId: vehicle.id, efficiency };
        });

        return efficiencyData.reduce((best, current) => (current.efficiency < best.efficiency ? current : best));
    }

    async findAllVehicleWithStatus(status: VehicleStatus): Promise<VehicleDto[]> {
        const result = await this.prisma.vehicle.findMany({
            where: { status: status },
        });
        return result;
    }

    async findAllFreeVehicle(): Promise<any> {
        const result = await this.prisma.vehicle.findMany({
            where: {
                status: "FREE",
            },
            select: {
                id: true,
                status: true,
                currentLocation: true,
            },
            // batteryVehicle: {
            // include: {
            //     , 

            //     battery: {
            //         select: {
            //             chargeLevel: true, // Уровень заряда батареи
            //         },
            //     },
            //     location: {
            //         select: {
            //             latitude: true, // Широта
            //             longitude: true, // Долгота
            //             address: true,  // Адрес (если есть)
            //         },
            //     },
            // },
        });

        // return result.map(vehicle => ({
        //     id: vehicle.id,
        //     model: vehicle.model,
        //     status: vehicle.status,
        //     batteryCharge: vehicle.battery?.chargeLevel || 0, // Заряд батареи или 0, если нет батареи
        //     location: vehicle.location ? {
        //         latitude: vehicle.location.latitude,
        //         longitude: vehicle.location.longitude,
        //         address: vehicle.location.address || '',
        //     } : null,
        // }));


        return result;
    }

    async calculateAverageUsageTime(vehicleId: string): Promise<number> {
        const rentals = await this.prisma.rentalVehicle.findMany({
            where: { vehicleId },
            include: { rental: true },
        });
    
        if (rentals.length === 0) {
            return 0; // Якщо оренд немає, повертаємо 0
        }
    
        // Обчислюємо загальний час використання
        const totalUsageTime = rentals.reduce((sum, rentalVehicle) => {
            const rental = rentalVehicle.rental;
            const dateRented = new Date(rental.dateRented);
            const dateReturned = new Date(rental.dateReturned);
            const usageTime = (dateReturned.getTime() - dateRented.getTime()) / 3600000; // Час у годинах
            return sum + usageTime;
        }, 0);
    
        // Обчислюємо середній час використання
        return totalUsageTime / rentals.length;
    }
    
    async countRentalsByVehicle(): Promise<{ vehicleId: string; rentalCount: number }[]> {
        const vehicles = await this.prisma.vehicle.findMany({
            include: { rentalVehicle: true },
        });
    
        // Підраховуємо кількість прокатів для кожного транспортного засобу
        return vehicles.map(vehicle => ({
            vehicleId: vehicle.id,
            rentalCount: vehicle.rentalVehicle.length,
        }));
    }
    
}
