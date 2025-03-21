import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BatteryVehicleService } from './battery-vehicle.service';
import { BatteryVehicleDto } from './dtos/battery-vehicle.dto';
import { UpdateBatteryVehicleDto } from './dtos/update-battery-vehicle.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('battery-vehicle')
@Controller('battery-vehicle')
export class BatteryVehicleController {
    constructor(private readonly batteryVehicleService: BatteryVehicleService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all battery vehicles returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllBatteryVehicle() {
        const result = await this.batteryVehicleService.findAllBatteryVehicle();
        return result;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Battery vehicle created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createBatteryVehicle(@Body() batteryVehicle: BatteryVehicleDto) {
        const result = await this.batteryVehicleService.createBatteryVehicle(batteryVehicle);
        return result;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Battery vehicle updated successfully.' })
    @ApiResponse({ status: 404, description: 'Battery vehicle not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async updateBatteryVehicle(@Body() batteryVehicle: UpdateBatteryVehicleDto, @Param('id') id: string) {
        const result = await this.batteryVehicleService.updateBatteryVehicle(batteryVehicle, id);
        return result;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Battery vehicle deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Battery vehicle not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async deleteBatteryVehicle(@Param('id') id: string) {
        const result = await this.batteryVehicleService.deleteBatteryVehicle(id);
        return result;
    }
}
