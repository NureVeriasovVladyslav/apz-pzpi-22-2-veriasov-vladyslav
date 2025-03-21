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

        return payments.reduce((total, payment) => total + parseFloat(payment.amount), 0);
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

        // const resultPayment = await this.prisma.payment.create({
        //     data: {
        //         rentalId: resultRental.id,
        //         amount: 0,
        //         date: new Date().toISOString(),
        //     },
        // });

        // const resultRental = await this.prisma.rental.create({ data: { ...rental } });

        return {
            id: resultRental.id,
            userId: resultRental.userId,
            dateRented: resultRental.dateRented,
            dateReturned: resultRental.dateReturned,
            distance: resultRental.distance,
            avgSpeed: resultRental.avgSpeed,
            maxSpeed: resultRental.maxSpeed,
            energyConsumed: resultRental.energyConsumed,
            isActive: resultRental.isActive,
            vehicleId: resultRentalVehicle.vehicleId,
            // rentalId: resultRentalVehicle.rentalId,
        };
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
        const traveledDistance = Math.random() * 100; // Дистанція у кілометрах
        const traveledTimeMs = new Date().getTime() - new Date(rental.dateRented).getTime(); // Час у мілісекундах
        const traveledTimeHours = traveledTimeMs / 3600000; // Час у годинах

        // Приклад розрахунку середньої швидкості
        const avgSpeed = traveledDistance / traveledTimeHours;
        const maxSpeed = 28; // Максимальна швидкість у км/год
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
                avgSpeed: avgSpeed,
                maxSpeed: maxSpeed, // повинно бути знято з контролера
                energyConsumed,
            },
        });

        return {
            ...resultPayment,
            rentalVehicleId: payment.rentalVehicleId,
        };
    }
}
