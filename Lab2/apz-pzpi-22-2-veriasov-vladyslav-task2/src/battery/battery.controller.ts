import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BatteryDto } from './dtos/battery.dto';
import { BatteryService } from './battery.service';
import { UpdateBatteryDto } from './dtos/update-battery.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('battery')
@Controller('battery')
export class BatteryController {
    constructor(private readonly batteryService: BatteryService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all batteries returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllBattery() {
        const result = await this.batteryService.findAllBattery();
        return result;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Battery created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createBattery(@Body() battery: BatteryDto) {
        const result = await this.batteryService.createBattery(battery);
        return result;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Battery updated successfully.' })
    @ApiResponse({ status: 404, description: 'Battery not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async updateBattery(@Body() battery: UpdateBatteryDto, @Param('id') id: string) {
        const result = await this.batteryService.updateBattery(battery, id);
        return result;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Battery deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Battery not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async deleteBattery(@Param('id') id: string) {
        const result = await this.batteryService.deleteBattery(id);
        return result;
    }

    @Get('status')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN , Role.MODERATOR)
    @ApiBearerAuth()
    @HttpCode(200)
    async getBatteryStatuses(): Promise<{ batteryId: string; status: string }[]> {
        try {
            const result = await this.batteryService.calculateBatteryStatus();
            return result;
        } catch (error) {
            throw new Error(`Error while retrieving battery statuses: ${error.message}`);
        }
    }

    @Get('implemented/battery/vehicle/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN , Role.TECHNICIAN , Role.MODERATOR)
    @ApiBearerAuth()
    @HttpCode(200)
    async getImplementedBatteryInVehicle(@Param('id') id: string): Promise<BatteryDto[]> {
        const result = await this.batteryService.getImplementedBatteryInVehicle(id);
        return result;
    }

    // @Post()
    // @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.ADMIN , Role.TECHNICIAN)
    // @ApiBearerAuth()
    // @HttpCode(201)
    // @ApiResponse({ status: 201, description: 'Battery created successfully.' })
    // @ApiResponse({ status: 400, description: 'Invalid input data.' })
    // @ApiResponse({ status: 500, description: 'Internal server error.' })
    // public async implementBattery(@Body() battery: BatteryDto) {
    //     const result = await this.batteryService.implementBattery(battery);
    //     return result;
    // }
}
