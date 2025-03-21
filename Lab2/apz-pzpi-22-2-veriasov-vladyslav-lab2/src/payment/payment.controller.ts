import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnershipGuard } from 'src/auth/ownership.guard';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.MODERATOR)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all payments returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllPayment() {
        const result = await this.paymentService.findAllPayment();
        return result;
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.MODERATOR, Role.USER)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all payments returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllPaymentByUser(@Param('userId') userId: string) {
        const result = await this.paymentService.findAllPaymentByUser(userId);
        return result;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.USER)
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Payment created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createPayment(@Body() payment: PaymentDto) {
        const result = await this.paymentService.createPayment(payment);
        return result;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.MODERATOR , Role.USER)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Payment updated successfully.' })
    @ApiResponse({ status: 404, description: 'Payment not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async updatePayment(@Body() payment: UpdatePaymentDto, @Param('id') id: string) {
        const result = await this.paymentService.updatePayment(payment, id);
        return result;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.USER)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Payment deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Payment not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async deletePayment(@Param('id') id: string) {
        const result = await this.paymentService.deletePayment(id);
        return result;
    }
}
