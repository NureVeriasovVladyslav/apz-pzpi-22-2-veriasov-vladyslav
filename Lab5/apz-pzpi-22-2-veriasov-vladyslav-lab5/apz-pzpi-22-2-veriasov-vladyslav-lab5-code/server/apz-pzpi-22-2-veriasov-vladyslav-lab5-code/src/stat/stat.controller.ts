import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { StatService } from './stat.service';
import { RoleGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@Controller('stat')
export class StatController {
    constructor(private readonly statService: StatService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.MODERATOR, Role.ADMIN)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all rentals returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async getStats() {
        return await this.statService.getStats();
    }
}
