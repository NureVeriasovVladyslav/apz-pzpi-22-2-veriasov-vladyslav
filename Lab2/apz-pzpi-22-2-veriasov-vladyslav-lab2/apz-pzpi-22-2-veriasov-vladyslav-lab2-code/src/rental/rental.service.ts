import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RentalDto } from './dtos/rental.dto';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { PaymentDto } from 'src/user/dtos/userPlus.dto';
import { RentalVehicleDto } from 'src/rental-vehicle/dtos/rental-vehicle.dto';
import { VehicleDto } from 'src/vehicle/dtos/vehicle.dto';
import { CreateRentalVehicleDto } from 'src/rental-vehicle/dtos/create-rental-vehicle.dto';
import { CreatePaymentDto } from 'src/payment/dtos/create-payment.dto';
import { RentalNotFoundException } from 'src/exceptions/user-exceptions';
import { Rental } from '@prisma/client';
import { strict } from 'assert';
import { RentalFullDto } from './dtos/rental-full.dto';
import { CreateRentalFullDto } from './dtos/create-rental-full.dto';
import { PaymentRentalVehicleDto } from './dtos/paymentRentalVehicle.dto';

// import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
// import { point, polygon } from '@turf/helpers';

@Injectable()
export class RentalService {
    constructor(private prisma: PrismaService) { }

    async findAllRental(): Promise<RentalDto[]> {
        const result = await this.prisma.rental.findMany();
        return result;
    }

    async createRental(rental: RentalDto): Promise<CreateRentalDto> {
        const result = await this.prisma.rental.create({ data: { ...rental } });
        return result;
    }

    // async createRentalFull(rental: RentalFullDto): Promise<CreateRentalDto> {
    //     const resultRental = await this.prisma.rental.create({
    //         data: {
    //             userId: rental.userId,
    //             dateRented: new Date().toISOString(),
    //             distance: rental.distance,
    //             avgSpeed: rental.avgSpeed,
    //             maxSpeed: rental.maxSpeed,
    //             energyConsumed: rental.energyConsumed,
    //             isActive: true,
    //         },
    //     });
    //     console.log("vehicleId", rental.vehicleId)
    //     // // Перевірка, чи транспортний засіб існує та чи має статус "FREE"
    //     // const vehicle = await this.prisma.vehicle.findUnique({
    //     //     where: { id: rental.vehicleId },
    //     // });

    //     // if (!vehicle) {
    //     //     throw new Error('Vehicle not found.');
    //     // }

    //     // if (vehicle.status !== 'FREE') {
    //     //     throw new Error('Vehicle is not available for rental.');
    //     // }

    //     // // Створення нового запису оренди
    //     // const newRental = await this.prisma.rental.create({
    //     //     data: { 
    //     //         userId: rental.userId,
    //     //         dateRented: new Date().toISOString(), // Встановлюємо поточну дату
    //     //         isActive: true,
    //     //         distance: 0, // Початкова дистанція
    //     //         avgSpeed: 0,
    //     //         maxSpeed: 0,
    //     //         energyConsumed: 0,
    //     //     },
    //     // });

    //     // // Додавання запису до таблиці RentalVehicle
    //     // await this.prisma.rentalVehicle.create({
    //     //     data: {
    //     //         vehicleId: rental.vehicleId,
    //     //         rentalId: newRental.id,
    //     //     },
    //     // });

    //     // // Оновлення статусу транспортного засобу
    //     // await this.prisma.vehicle.update({
    //     //     where: { id: rental.vehicleId },
    //     //     data: { status: 'INUSE' },
    //     // });

    //     //return newRental;
    //     return resultRental;
    // }



    async updateRental(rental: UpdateRentalDto, id: string): Promise<CreateRentalDto> {
        const result = await this.prisma.rental.update({ data: { ...rental }, where: { id: id } });
        return result;
    }

    async deleteRental(id: string): Promise<CreateRentalDto> {
        const result = await this.prisma.rental.delete({ where: { id: id } });
        return result;
    }

    async calculateTotalProfit(startDate: string, endDate: string): Promise<number> {
        const payments = await this.prisma.payment.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        // return payments.reduce((total, payment) => total + parseFloat(payment.amount), 0);
        return payments.reduce((total, payment) => total + payment.amount.toNumber(), 0);
    }

    // async createRentalFull(
    //     rental: RentalDto,
    //     payment: PaymentDto,
    //     rentalVehicle: RentalVehicleDto
    // ): Promise<CreateRentalDto> {
    //     const result = await this.prisma.$transaction(async (prisma) => {
    //         // Створення прокату
    //         const newRental = await prisma.rental.create({
    //             data: {
    //                 userId: rental.userId,
    //                 distance: rental.distance,
    //                 isActive: rental.isActive,
    //                 avgSpeed: rental.avgSpeed,
    //                 maxSpeed: rental.maxSpeed,
    //                 energyConsumed: rental.energyConsumed,
    //                 dateRented: rental.dateRented,
    //                 dateReturned: rental.dateReturned,
    //                 rentalVehicle: {
    //                     create: {
    //                         vehicleId: rentalVehicle.vehicleId,
    //                     },
    //                 },
    //                 payment: {
    //                     create: {
    //                         paymentMethod: payment.paymentMethod,
    //                         amount: payment.amount,
    //                         date: payment.date || new Date().toISOString(), // Встановлюємо поточну дату, якщо не передано
    //                     },
    //                 },
    //             },
    //             include: {
    //                 rentalVehicle: true,
    //                 payment: true,
    //             },
    //         });

    //         // Оновлення пройденої дистанції транспортного засобу
    //         await prisma.vehicle.update({
    //             where: { id: rentalVehicle.vehicleId },
    //             data: {
    //                 runnedDistance: { increment: rental.distance },
    //             },
    //         });

    //         return newRental;
    //     });

    //     return result;
    // }

    async getUserRentalsWithVehicles(userId: string) {
        return await this.prisma.rental.findMany({
            where: { userId },
            include: {
                rentalVehicle: {
                    include: {
                        vehicle: true,
                    },
                },
            },
        });
    }


    // Приклад методу, який може генерувати виключення
    async getRentalById(rentalId: string) {
        const rental = await this.prisma.rental.findUnique({
            where: { id: rentalId },
        });

        if (!rental) {
            throw new RentalNotFoundException(`Rental with ID ${rentalId} not found.`);
        }

        return rental;
    }
    async createRentalFull(rental: RentalFullDto): Promise<CreateRentalFullDto> {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const vehicle = await this.prisma.vehicle.findUnique({
                    where: { id: rental.vehicleId },
                });

                if (!vehicle) {
                    throw new NotFoundException('Vehicle not found');
                }

                const resultVehicle = await this.prisma.vehicle.update({
                    data: { ...vehicle, status: 'INUSE' }, where: { id: rental.vehicleId }
                });

                const resultRental = await this.prisma.rental.create({
                    data: {
                        userId: rental.userId,
                        dateRented: new Date().toISOString(),
                        dateReturned: "not returned",
                        distance: rental.distance,
                        startLocation: rental.startLocation,
                        avgSpeed: rental.avgSpeed,
                        maxSpeed: rental.maxSpeed,
                        energyConsumed: rental.energyConsumed,
                        isActive: true,
                    },
                });

                const resultRentalVehicle = await this.prisma.rentalVehicle.create({
                    data: {
                        rentalId: resultRental.id,
                        vehicleId: rental.vehicleId,
                    },
                });

                return {
                    id: resultRental.id,
                    userId: resultRental.userId,
                    dateRented: resultRental.dateRented,
                    dateReturned: resultRental.dateReturned,
                    startLocation: resultRental.startLocation,
                    distance: resultRental.distance,
                    avgSpeed: resultRental.avgSpeed,
                    maxSpeed: resultRental.maxSpeed,
                    energyConsumed: resultRental.energyConsumed,
                    isActive: resultRental.isActive,
                    vehicleId: resultRentalVehicle.vehicleId,
                    // rentalId: resultRentalVehicle.rentalId,
                };
            })
        } catch (error) {
            console.error('Error creating rental:', error);
            throw new BadRequestException('Failed to create rental');
        }

    }


    // async startRental(userId: string, vehicleId: string): Promise<Rental> {
    //     // Проверяем доступность транспортного средства
    //     const vehicle = await this.prisma.vehicle.findUnique({
    //         where: { id: vehicleId },
    //     });

    //     if (!vehicle) {
    //         throw new NotFoundException('Vehicle not found');
    //     }

    //     if (vehicle.status !== 'FREE') {
    //         throw new BadRequestException('Vehicle is not available for rental');
    //     }

    //     // Создаем запись аренды
    //     const rental = await this.prisma.rental.create({
    //         data: {
    //             userId,
    //             dateRented: new Date().toISOString(),
    //             distance: 0,
    //             avgSpeed: 0,
    //             maxSpeed: 0,
    //             energyConsumed: 0,
    //             isActive: true,
    //         },
    //     });

    //     // Создаем запись RentalVehicle
    //     await this.prisma.rentalVehicle.create({
    //         data: {
    //             rentalId: rental.id,
    //             vehicleId: vehicleId,
    //         },
    //     });

    //     // Обновляем статус транспортного средства
    //     await this.prisma.vehicle.update({
    //         where: { id: vehicleId },
    //         data: { status: 'INUSE' },
    //     });

    //     return rental;
    // }

    // async isInZone(lat: number, lng: number, geoJsonPolygon: any): Promise<boolean> {
    //     const pt = point([lng, lat]);
    //     const poly = polygon(geoJsonPolygon.coordinates);
    //     return booleanPointInPolygon(pt, poly);
    // }


    async endRentalFull(payment: PaymentRentalVehicleDto): Promise<PaymentRentalVehicleDto> {
        // Находим активную аренду
        console.log("payment", payment)
        const rentalVehicle = await this.prisma.rentalVehicle.findUnique({
            where: { id: payment.rentalVehicleId },
        });

        console.log("rentalVehicle", rentalVehicle)

        const rental = await this.prisma.rental.findUnique({
            where: { id: rentalVehicle.rentalId },
            include: { rentalVehicle: { include: { vehicle: true } } },
        });

        console.log("rental", rental)

        if (!rental || !rental.isActive) {
            throw new BadRequestException('Rental is not active or not found');
        }

        const vehicle = rental.rentalVehicle[0]?.vehicle;

        if (!vehicle) {
            throw new NotFoundException('Associated vehicle not found');
        }

        // Рассчитываем изменения

        const traveledTime = (new Date().getTime() - new Date(rental.dateRented).getTime()) / 3600000;
        const traveledDistance = (Math.random() * (25 - 15) + 10) * traveledTime; // Дистанція у кілометрах

        // Приклад розрахунку середньої швидкості
        const avgSpeed = traveledDistance / traveledTime;
        const maxSpeed = 25; // Максимальна швидкість у км/год
        const energyPerKm = 20; // Середнє енергоспоживання на 1 км у Wh

        // Фактор швидкості: якщо середня швидкість ближче до максимальної, енергоспоживання зростає.
        const speedFactor = avgSpeed / maxSpeed > 1 ? 1 : avgSpeed / maxSpeed;

        // Розрахунок витраченої енергії
        const energyConsumed = traveledDistance * energyPerKm * speedFactor;
        const amount = energyConsumed * 0.1; // Пример расчета оплаты: 0.1 доллара за 1 Wh

        // Создаем запись оплаты

        const resultPayment = await this.prisma.payment.create({
            data: {
                rentalId: rental.id,
                paymentMethod: payment.paymentMethod,
                amount: amount.toFixed(2),
                date: new Date().toISOString(),
            },
        });

        // Обновляем статус транспортного средства
        await this.prisma.vehicle.update({
            where: { id: vehicle.id },
            data: {
                status: 'FREE',
                runnedDistance: vehicle.runnedDistance + traveledDistance,
            },
        });

        // Обновляем заряд батареи
        const batteryVehicle = await this.prisma.batteryVehicle.findFirst({
            where: { vehicleId: vehicle.id },
            include: { battery: true },
        });

        if (batteryVehicle?.battery) {
            await this.prisma.battery.update({
                where: { id: batteryVehicle.battery.id },
                data: {
                    chargeLevel: Math.max(
                        batteryVehicle.battery.chargeLevel - energyConsumed,
                        0,
                    ),
                },
            });
        }

        // Завершаем аренду
        const updatedRental = await this.prisma.rental.update({
            where: { id: rental.id },
            data: {
                isActive: false,
                dateReturned: new Date().toISOString(),
                distance: traveledDistance,
                endLocation: payment.endLocation,
                avgSpeed: avgSpeed,
                maxSpeed: maxSpeed, // повинно бути знято з контролера
                energyConsumed,
            },
        });

        return {
            ...resultPayment,
            rentalVehicleId: payment.rentalVehicleId,
            endLocation: payment.endLocation,
        };
    }

    // Метод для оновлення місцезнаходження транспортного засобу
    async updateVehicleLocation(vehicleId: string, lat: number, lng: number) {
        try {
            // Переконайтемось, що транспорт існує
            const vehicle = await this.prisma.vehicle.findUnique({
                where: { id: vehicleId },
            });

            if (!vehicle) {
                throw new Error('Vehicle not found');
            }

            // Оновлюємо місцезнаходження з використанням PostGIS
            await this.prisma.$executeRaw`
        UPDATE "Vehicle" 
        SET currentLocation = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
        WHERE id = ${vehicleId}
      `;

            return { success: true, vehicleId, location: { lat, lng } };
        } catch (error) {
            console.error('Failed to update vehicle location:', error);
            throw error;
        }
    }

    // Метод для пошуку найближчих транспортних засобів
    async findNearbyVehicles(lat: number, lng: number, radiusInMeters: number = 500) {
        return this.prisma.$queryRaw`
      SELECT 
        v.id, 
        v.status,
        ST_Distance(
          v.currentLocation::geography, 
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
        ) as distance
      FROM "Vehicle" v
      WHERE 
        v.status = 'FREE'
        AND ST_DWithin(
          v.currentLocation::geography,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          ${radiusInMeters}
        )
      ORDER BY distance
      LIMIT 10
    `;
    }

    async calculateAverageRentalDuration(): Promise<number> {
        // Отримуємо всі завершені оренди (де dateReturned не null)
        const rentals = await this.prisma.rental.findMany({
            where: {
                NOT: {
                    dateReturned: "",
                }
            },
            select: {
                dateRented: true,
                dateReturned: true,
            },
        });

        if (rentals.length === 0) return 0;

        // Підрахунок загального часу у годинах
        const totalDuration = rentals.reduce((sum, rental) => {
            const start = new Date(rental.dateRented).getTime();
            const end = new Date(rental.dateReturned).getTime();
            const durationHours = (end - start) / 3600000; // мілісекунди → години
            return sum + durationHours;
        }, 0);

        // Середній час
        return Number((totalDuration / rentals.length).toFixed(2));
    }

    async getHourlyActivityDistribution(): Promise<{ [hour: string]: number }> {
        const rentals = await this.prisma.rental.findMany({
            select: { dateRented: true },
        });

        // Об'єкт: { "0": 5, "1": 2, ..., "23": 7 }
        const distribution: { [hour: string]: number } = {};

        for (let i = 0; i < 24; i++) {
            distribution[i.toString()] = 0;
        }

        for (const rental of rentals) {
            if (!rental.dateRented) continue;
            const hour = new Date(rental.dateRented).getHours();
            distribution[hour.toString()]++;
        }

        return distribution;
    }

    async getDailyActivityDistribution(): Promise<{ [date: string]: number }> {
        const rentals = await this.prisma.rental.findMany({
            select: { dateRented: true },
        });

        // Об'єкт: { "2025-06-01": 3, "2025-06-02": 7, ... }
        const distribution: { [date: string]: number } = {};

        for (const rental of rentals) {
            if (!rental.dateRented) continue;
            const date = new Date(rental.dateRented).toISOString().slice(0, 10); // YYYY-MM-DD
            if (!distribution[date]) distribution[date] = 0;
            distribution[date]++;
        }

        return distribution;
    }
    async getIdleTimesForVehicle(vehicleId: string): Promise<Array<{ idleStart: string, idleEnd: string, idleHours: number }>> {
        // 1. Отримати всі оренди для цього транспорту, відсортувати за dateRented
        const rentalVehicles = await this.prisma.rentalVehicle.findMany({
            where: { vehicleId },
            include: {
                rental: {
                    select: {
                        dateRented: true,
                        dateReturned: true,
                    }
                }
            },
            orderBy: {
                rental: {
                    dateRented: 'asc'
                }
            }
        });

        // 2. Відфільтрувати тільки завершені оренди (де є dateReturned)
        const completedRentals = rentalVehicles
            .map(rv => rv.rental)
            .filter(r => r.dateReturned && r.dateRented);

        // 3. Розрахувати простої між орендами
        const idleTimes: Array<{ idleStart: string, idleEnd: string, idleHours: number }> = [];

        for (let i = 0; i < completedRentals.length - 1; i++) {
            const prev = completedRentals[i];
            const next = completedRentals[i + 1];

            // Простій: від повернення попередньої до старту наступної
            const idleStart = prev.dateReturned;
            const idleEnd = next.dateRented;

            const start = new Date(idleStart).getTime();
            const end = new Date(idleEnd).getTime();
            const idleHours = (end - start) / 3600000;

            // Враховуємо тільки позитивний простій (можливо, дати некоректні)
            if (idleHours >= 0) {
                idleTimes.push({
                    idleStart,
                    idleEnd,
                    idleHours: Number(idleHours.toFixed(2))
                });
            }
        }

        return idleTimes;
    }
    async getAllVehiclesIdleTimes(): Promise<Record<string, Array<{ idleStart: string, idleEnd: string, idleHours: number }>>> {
        const vehicles = await this.prisma.vehicle.findMany({
            select: { id: true }
        });

        const result: Record<string, Array<{ idleStart: string, idleEnd: string, idleHours: number }>> = {};

        for (const vehicle of vehicles) {
            result[vehicle.id] = await this.getIdleTimesForVehicle(vehicle.id);
        }

        return result;
    }

    /////=============================

    // Функція для визначення ключа квадрата (grid cell)
    private getGridCellKey(lat: number, lng: number, cellSize = 0.002): string {
        const latIndex = Math.floor(lat / cellSize);
        const lngIndex = Math.floor(lng / cellSize);
        return `${latIndex}_${lngIndex}`;
    }

    // Найпопулярніші зони старту
    async getPopularStartZones(cellSize = 0.002, topN = 10) {
        console.log("zoneRevenue")
        const rentals = await this.prisma.rental.findMany({
            select: { startLocation: true }, // currentLocation = стартова точка
        });
        console.log("rentals", rentals)
        const zoneCounts: Record<string, number> = {};

        for (const rental of rentals) {
            const loc = rental.startLocation as any;
            if (loc && loc.latitude !== undefined && loc.longitude !== undefined) {
                const key = this.getGridCellKey(loc.latitude, loc.longitude, cellSize);
                zoneCounts[key] = (zoneCounts[key] || 0) + 1;
            }
        }
        console.log("zoneCounts", zoneCounts)
        // Топ-N зон
        return Object.entries(zoneCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN)
            .map(([cellKey, count]) => ({
                cellKey,
                count,
                // Центр квадрата для візуалізації
                centerLat: Number(cellKey.split('_')[0]) * cellSize + cellSize / 2,
                centerLng: Number(cellKey.split('_')[1]) * cellSize + cellSize / 2,
            }));
    }

    // Найпопулярніші зони фінішу (якщо є endLocation)
    async getPopularEndZones(cellSize = 0.002, topN = 10) {
        const rentals = await this.prisma.rental.findMany({
            select: { endLocation: true }, // Додай це поле у Rental, якщо його ще немає!
        });

        const zoneCounts: Record<string, number> = {};

        for (const rental of rentals) {
            const loc = rental.endLocation as any;
            if (loc && loc.latitude !== undefined && loc.longitude !== undefined) {
                const key = this.getGridCellKey(loc.latitude, loc.longitude, cellSize);
                zoneCounts[key] = (zoneCounts[key] || 0) + 1;
            }
        }

        return Object.entries(zoneCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN)
            .map(([cellKey, count]) => ({
                cellKey,
                count,
                centerLat: Number(cellKey.split('_')[0]) * cellSize + cellSize / 2,
                centerLng: Number(cellKey.split('_')[1]) * cellSize + cellSize / 2,
            }));
    }

    // Найприбутковіші зони старту
    async getMostProfitableStartZones(cellSize = 0.002, topN = 10) {
        console.log("zoneRevenue")
        // Витягуємо всі поїздки з платежами
        const rentals = await this.prisma.rental.findMany({
            select: {
                id: true,
                payment: { select: { amount: true } }, // payment має бути зв'язком rentalId → Payment
                startLocation: true,
            },
        });

        const zoneRevenue: Record<string, number> = {};

        for (const rental of rentals) {
            const loc = rental.startLocation as any;
            const amount = rental.payment?.amount ? Number(rental.payment.amount) : 0;
            if (loc && loc.latitude !== undefined && loc.longitude !== undefined) {
                const key = this.getGridCellKey(loc.latitude, loc.longitude, cellSize);
                zoneRevenue[key] = (zoneRevenue[key] || 0) + amount;
            }
        }
        console.log("zoneRevenue", zoneRevenue)

        return Object.entries(zoneRevenue)
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN)
            .map(([cellKey, totalRevenue]) => ({
                cellKey,
                totalRevenue,
                centerLat: Number(cellKey.split('_')[0]) * cellSize + cellSize / 2,
                centerLng: Number(cellKey.split('_')[1]) * cellSize + cellSize / 2,
            }));
    }
}   
