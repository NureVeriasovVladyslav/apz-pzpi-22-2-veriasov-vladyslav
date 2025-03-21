import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentDto } from './dtos/payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }

    async findAllPayment(): Promise<PaymentDto[]> {
        const result = await this.prisma.payment.findMany();
        return result;
    }

    async createPayment(payment: PaymentDto): Promise<CreatePaymentDto> {
        const result = await this.prisma.payment.create({ data: { ...payment } });
        return result;
    }

    async updatePayment(payment: UpdatePaymentDto, id: string): Promise<CreatePaymentDto> {
        const result = await this.prisma.payment.update({ data: { ...payment }, where: { id: id } });
        return result;
    }

    async deletePayment(id: string): Promise<CreatePaymentDto> {
        const result = await this.prisma.payment.delete({ where: { id: id } });
        return result;
    }

    // async getAllUserPayments(userId: string): Promise<PaymentDto> {
    //     const result = await this.prisma.user.findMany({
    //         where: { userId: id },
    //         include: {
    //           rental: {
    //             include: {
    //               rentalVehicle: { include: { vehicle: true } },
    //               payment: true,
    //             },
    //           },
    //         },
    //      });
    //     return result;
    // }

    async findAllPaymentByUser(id: string): Promise<PaymentDto[]> {
        const result = await this.prisma.payment.findMany({
            where: {
                rental:{
                    userId: id
                }
            }
        });
        return result;
    }

    // async findAllPaymentByUser(userId: string): Promise<PaymentDto[]> {
    //     // Находим все аренды пользователя
    //     const rentals = await this.prisma.rental.findMany({
    //         where: { userId },
    //         select: { id: true }, // Извлекаем только id аренды
    //     });

    //     const rentalIds = rentals.map((rental) => rental.id);

    //     if (rentalIds.length === 0) {
    //         return []; // Если у пользователя нет аренд, возвращаем пустой массив
    //     }

    //     // Находим платежи, связанные с арендами пользователя
    //     const payments = await this.prisma.payment.findMany({
    //         where: {
    //             rentalId: { in: rentalIds },
    //         },
    //     });

    //     return payments as PaymentDto[];
    // }


}
