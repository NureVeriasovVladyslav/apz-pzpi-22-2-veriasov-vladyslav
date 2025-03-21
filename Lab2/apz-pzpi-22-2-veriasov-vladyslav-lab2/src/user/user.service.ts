import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaymentDto, RentalDto } from './dtos/userPlus.dto';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from 'src/auth/auth.entity';
import { AuthService } from 'src/auth/auth.service';
import { register } from 'module';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private authService: AuthService) { }

    async findOne(email: string): Promise<UserDto> {
        return this.prisma.user.findUnique({ where: { email: email } });
    }

    async findAllUser(): Promise<UserDto[]> {
        const result = await this.prisma.user.findMany();
        return result;
    }

    // async createUser(user: UserDto): Promise<CreateUserDto> {
    //     const result = await this.prisma.user.create({ data: { ...user } });
    //     return result;
    // }

    async createUser(user: UserDto): Promise<any> {
        // Хешування пароля
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log(hashedPassword)
        console.log(user)

        // Створення користувача з хешованим паролем
        // const result = await this.prisma.user.create({
        //     data: {
        //         ...user,
        //         password: `${hashedPassword}`
        //     },
        // });

        // console.log(result)
        // let res = await this.authService.register(result.email, result.password);
        let res = await this.authService.register(user);
        console.log(res)
        const options = { expiresIn: '1h', privateKey: process.env.JWTSECRET };
        //         return {
        //             accessToken: this.jwtService.sign(payload, options),
        //         };
        let auth = await this.authService.login(user, options);
        return auth
        // return await this.authService.signIn(result.email, result.password);
    }

    async updateUser(user: UpdateUserDto, email: string): Promise<CreateUserDto> {
        // Хешування пароля
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Створення користувача з хешованим паролем
        const result = await this.prisma.user.update({
            data: { ...user, password: hashedPassword }, where: { email: email }
        });
        return result;
    }

    async deleteUser(id: string): Promise<CreateUserDto> {
        const result = await this.prisma.user.delete({ where: { id: id } });
        return result;
    }

    async getUserPlus(id: string): Promise<CreateUserDto> {
        const result = await this.prisma.user.findUnique({
            where: { id: id },
            include: {
                rental: {
                    include: {
                        rentalVehicle: { include: { vehicle: true } },
                        payment: true,
                    },
                },
            },
        });
        return result;
    }

    async getAllUserPayments(userId: string): Promise<PaymentDto[]> {
        const result = await this.prisma.user.findUnique({
            where: { id: userId },  // використовується id, а не userId
            include: {
                rental: {
                    where: { userId: userId },  // фільтруємо за userId в rental
                    include: {
                        payment: true,  // включаємо payment для кожного оренди
                        rentalVehicle: {
                            include: {
                                vehicle: true,  // включаємо інформацію про транспортний засіб
                            },
                        },
                    },
                },
            },
        });

        // Повертаємо масив платежів
        return result?.rental.map(rental => rental.payment) || [];
    }

    async getAllUserRentals(userId: string): Promise<RentalDto[]> {
        const result = await this.prisma.user.findUnique({
            where: { id: userId },  // Пошук користувача за id
            include: {
                rental: {
                    where: { userId: userId },  // Фільтруємо оренди користувача
                    include: {
                        rentalVehicle: true,  // Включаємо інформацію про транспортні засоби
                        payment: true,         // Включаємо інформацію про оплату
                    },
                },
            },
        });

        // Перевіряємо, чи є оренди і повертаємо їх, якщо є
        return result?.rental.map(rental => ({
            id: rental.id,
            isActive: rental.isActive,
            dateRented: rental.dateRented,
            dateReturned: rental.dateReturned,
            userId: rental.userId,
            distance: rental.distance,
            avgSpeed: rental.avgSpeed,
            maxSpeed: rental.maxSpeed,
            energyConsumed: rental.energyConsumed,
            rentalVehicle: rental.rentalVehicle,  // Додаємо rentalVehicle
            payment: rental.payment,              // Додаємо payment
        })) || [];
    }


}
