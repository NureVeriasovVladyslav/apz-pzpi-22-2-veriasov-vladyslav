import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RentalService } from './rental.service';
import { RentalDto } from './dtos/rental.dto';
import { UpdateRentalDto } from './dtos/update-rental.dto';
import { PaymentMethodTypes } from '@prisma/client';
import { CreateRentalDto } from './dtos/create-rental.dto';

import { RentalVehicleDto } from 'src/rental-vehicle/dtos/rental-vehicle.dto';
import { PaymentDto } from 'src/user/dtos/userPlus.dto';
import { RentalNotFoundException } from 'src/exceptions/user-exceptions';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnershipGuard } from 'src/auth/ownership.guard';
import { RentalFullDto } from './dtos/rental-full.dto';
import { CreateRentalFullDto } from './dtos/create-rental-full.dto';
import { PaymentRentalVehicleDto } from './dtos/paymentRentalVehicle.dto';

@ApiTags('rental')
@Controller('rental')
export class RentalController {
    constructor(private readonly rentalService: RentalService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all rentals returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllRental() {
        const result = await this.rentalService.findAllRental();
        return result;
    }

    @Post(':vehicleId')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Rental created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createRental(@Body() rental: RentalDto) {
        const result = await this.rentalService.createRental(rental);
        return result;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Rental updated successfully.' })
    @ApiResponse({ status: 404, description: 'Rental not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async updateRental(@Body() rental: UpdateRentalDto, @Param('id') id: string) {
        const result = await this.rentalService.updateRental(rental, id);
        return result;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Rental deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Rental not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async deleteRental(@Param('id') id: string) {
        const result = await this.rentalService.deleteRental(id);
        return result;
    }

    @Get('total')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @HttpCode(200)
    async getTotalProfit(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ): Promise<{ totalProfit: number }> {
        try {
            const totalProfit = await this.rentalService.calculateTotalProfit(startDate, endDate);
            return { totalProfit };
        } catch (error) {
            throw new Error(`Error while calculating total profit: ${error.message}`);
        }
    }


    @Get(':userId/rentals-with-vehicles')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'List of rentals with vehicles.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    public async getUserRentalsWithVehicles(@Param('userId') userId: string) {
        const result = await this.rentalService.getUserRentalsWithVehicles(userId);
        return result;
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @HttpCode(200)
    async getRentalById(@Param('id') id: string) {
        try {
            const rental = await this.rentalService.getRentalById(id);
            return rental;
        } catch (error) {
            if (error instanceof RentalNotFoundException) {
                throw new NotFoundException(error.message);  // HTTP 404
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    // @Post(':full')
    // @HttpCode(201)
    // @ApiResponse({ status: 201, description: 'Rental with payment and vehicle created successfully.' })
    // @ApiResponse({ status: 400, description: 'Invalid input data.' })
    // @ApiResponse({ status: 500, description: 'Internal server error.' })
    // public async createRentalFull(
    //   @Body() body: { rental: RentalFullDto}
    // ): Promise<CreateRentalFullDto> {
    //   try {
    //     const { rental } = body;

    //     if (!rental) {
    //       throw new HttpException('Invalid input data.', HttpStatus.BAD_REQUEST);
    //     }

    //     const result = await this.rentalService.createRentalFull(rental);
    //     return result;
    //   } catch (error) {
    //     throw new HttpException(
    //       'Internal server error.',
    //       HttpStatus.INTERNAL_SERVER_ERROR
    //     );
    //   }
    // }

    @Post('full/start/:data')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Rental created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createRentalFull(@Body() rental: RentalFullDto) {
        const result = await this.rentalService.createRentalFull(rental);
        return result;
    }

    @Post('full/end/:payment')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Rental created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async endRentalFull(@Body() paymentRentalVehicle: PaymentRentalVehicleDto) {
        const result = await this.rentalService.endRentalFull(paymentRentalVehicle);
        return result;
    }

    @Get('all/rental/average-duration')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN, Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Average rental duration returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async calculateAverageRentalDuration(): Promise<number> {
        return await this.rentalService.calculateAverageRentalDuration();
    }

    @Get('activity/hourly')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN, Role.TECHNICIAN)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Hourly activity distribution returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getHourlyActivityDistribution() {
        return await this.rentalService.getHourlyActivityDistribution();
    }

    @Get('activity/daily')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN, Role.TECHNICIAN)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Daily activity distribution returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getDailyActivityDistribution() {
        return await this.rentalService.getDailyActivityDistribution();
    }

    @Get('idle-times/:vehicleId')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN, Role.TECHNICIAN)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Idle times for vehicle returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getIdleTimesForVehicle(@Param('vehicleId') vehicleId: string) {
        return await this.rentalService.getIdleTimesForVehicle(vehicleId);
    }

    @Get('idle-times/all')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN, Role.TECHNICIAN)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Idle times for vehicle returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getAllVehiclesIdleTimes() {
        return await this.rentalService.getAllVehiclesIdleTimes();
    }

    @Get('popular-start-zones/:cellSize/:topN')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.MODERATOR, Role.TECHNICIAN)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Popular start zones returned.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getPopularStartZones(@Param('cellSize') cellSize: number, @Param('topN') topN: number) {
        // @Query('cellSize') cellSize?: number,
        // @Query('topN') topN?: number
        console.log("zoneRevenue")
        return this.rentalService.getPopularStartZones(cellSize, topN);
    }

    @Get('popular-end-zones/:cellSize/:topN')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.MODERATOR, Role.TECHNICIAN)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Popular end zones returned.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async getPopularEndZones(@Param('cellSize') cellSize: number, @Param('topN') topN: number
        // @Query('cellSize') cellSize?: number,
        // @Query('topN') topN?: number
    ) {
        return this.rentalService.getPopularEndZones(cellSize, topN);
    }

    @Get('most-profitable-start-zones/:cellSize/:topN')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.MODERATOR, Role.TECHNICIAN)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Most profitable start zones returned.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async getMostProfitableStartZones(
        @Param('cellSize') cellSize: number, @Param('topN') topN: number
    ) {
        return this.rentalService.getMostProfitableStartZones(cellSize, topN);
    }
}
