import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { VehicleDto } from './dtos/vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role, VehicleStatus } from '@prisma/client';
import { RoleGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('vehicle')
@Controller('vehicle')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR , Role.ADMIN , Role.USER , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all vehicles returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllVehicle() {
        const result = await this.vehicleService.findAllVehicle();
        return result;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Vehicle created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createVehicle(@Body() vehicle: VehicleDto) {
        const result = await this.vehicleService.createVehicle(vehicle);
        return result;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR , Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Vehicle updated successfully.' })
    @ApiResponse({ status: 404, description: 'Vehicle not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async updateVehicle(@Body() vehicle: UpdateVehicleDto, @Param('id') id: string) {
        const result = await this.vehicleService.updateVehicle(vehicle, id);
        return result;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Vehicle deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Vehicle not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async deleteVehicle(@Param('id') id: string) {
        const result = await this.vehicleService.deleteVehicle(id);
        return result;
    }

    @Get('vehicle/distance/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR , Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all vehicles returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async calculateTotalDistance(@Param('id') vehicleId: string): Promise<number> {
        const result = await this.vehicleService.calculateTotalDistance(vehicleId);
        return result;
    }


    @Get('vehicle/avg/speed/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR , Role.ADMIN , Role.USER , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all vehicles returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async calculateAverageSpeed(@Param('id') vehicleId: string): Promise<number> {
        const result = await this.vehicleService.calculateAverageSpeed(vehicleId);
        return result;
    }

    @Get('vehicle/info/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR , Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all vehicles returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getVehicleInfo(@Param('id') vehicleId: string): Promise<VehicleDto> {
        const result = await this.vehicleService.getVehicleInfo(vehicleId);
        return result;
    }

    @Get('most-efficient')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR , Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all vehicles returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getMostEfficientVehicle(): Promise<{ vehicleId: string; efficiency: number }> {
        try {
            const result = await this.vehicleService.findMostEfficientVehicle();
            return result;
        } catch (error) {
            throw new Error(`Error while calculating the most efficient vehicle: ${error.message}`);
        }
    }

    @Get('vehicle/with/:status')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR , Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all vehicles returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllVehicleWithStatus(@Param('status') status: VehicleStatus): Promise<VehicleDto[]> {
        const result = await this.vehicleService.findAllVehicleWithStatus(status);
        return result;
    }
    
    @Get('vehicle/free')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.USER, Role.ADMIN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all vehicles returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllFreeVehicle(): Promise<VehicleDto[]> {
        const result = await this.vehicleService.findAllFreeVehicle();
        return result;
    }

    @Get('average-usage-time/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN, Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Average usage time returned successfully.' })
    @ApiResponse({ status: 404, description: 'Vehicle not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async calculateAverageUsageTime(@Param('id') id: string): Promise<{ averageUsageTime: number }> {
        const averageUsageTime = await this.vehicleService.calculateAverageUsageTime(id);
        return { averageUsageTime };
    }

    @Get('rental-counts')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN, Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Rental counts returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async countRentalsByVehicle(): Promise<{ vehicleId: string; rentalCount: number }[]> {
        const rentalCounts = await this.vehicleService.countRentalsByVehicle();
        return rentalCounts;
    }
}
