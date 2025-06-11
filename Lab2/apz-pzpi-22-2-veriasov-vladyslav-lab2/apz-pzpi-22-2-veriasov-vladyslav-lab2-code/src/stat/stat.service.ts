import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<{ rides: number; scooters: number; revenue: number }> {
    // Кількість поїздок (Rental)
    const rides = await this.prisma.rental.count();

    // Кількість самокатів (Vehicle)
    const scooters = await this.prisma.vehicle.count();

    // Сума оплат (Payment)
    const result = await this.prisma.payment.aggregate({
      _sum: { amount: true },
    });
    let revenue = result._sum.amount ?? 0;
    revenue = parseFloat(revenue.toFixed(2)); // Форматуємо до двох знаків після коми

    return { rides, scooters, revenue };
  }
}
