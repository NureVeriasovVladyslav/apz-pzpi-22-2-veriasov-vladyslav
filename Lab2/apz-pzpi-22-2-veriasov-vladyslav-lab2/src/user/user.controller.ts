import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaymentDto, RentalDto } from './dtos/userPlus.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { OwnershipGuard } from 'src/auth/ownership.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOkResponse({ type: [UserDto] })
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'List of all users returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async findAllUser() {
        const result = await this.userService.findAllUser();
        return result;
    }

    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createUser(@Body() user: UserDto) {
        const result = await this.userService.createUser(user);
        return result;
    }

    // @Put(':email')
    // @HttpCode(200)
    // @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.ADMIN, Role.USER)
    // @ApiBearerAuth()
    // @ApiResponse({ status: 200, description: 'User updated successfully.' })
    // @ApiResponse({ status: 404, description: 'User not found.' })
    // @ApiResponse({ status: 500, description: 'Internal server error.' })
    // public async updateUser(@Body() user: UpdateUserDto, @Param('email') email: string) {
    //     const result = await this.userService.updateUser(user, email);
    //     return result
    // }

    @Put(':email')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, RoleGuard, OwnershipGuard)
    @Roles(Role.ADMIN, Role.USER)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async updateUser(@Body() user: UpdateUserDto, @Param('email') email: string) {
        const result = await this.userService.updateUser(user, email);
        return result;
    }

    @Delete(':id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async deleteUser(@Param('id') id: string) {
        const result = await this.userService.deleteUser(id);
        return result;
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RoleGuard, OwnershipGuard)
    @Roles(Role.USER, Role.ADMIN, Role.MODERATOR)
    // @Roles(Role.ADMIN)
    // @Roles(Role.MODERATOR )
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'User details returned successfully.' })
    @HttpCode(404)
    @ApiResponse({ status: 404, description: 'User not found.' })
    @HttpCode(500)
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getUserDetails(@Param('id') userId: string): Promise<UserDto> {
        console.log(userId);
        return this.userService.getUserPlus(userId);
    }

    @Get('payments/user/:id')
    @UseGuards(JwtAuthGuard, RoleGuard, OwnershipGuard)
    @Roles(Role.USER, Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'User details returned successfully.' })
    @HttpCode(404)
    @ApiResponse({ status: 404, description: 'User not found.' })
    @HttpCode(500)
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getAllUserPayments(@Param('id') userId: string): Promise<PaymentDto[]> {
        return this.userService.getAllUserPayments(userId);
    }

    @Get('rentals/user/:id')
    @UseGuards(JwtAuthGuard, RoleGuard, OwnershipGuard)
    @Roles(Role.USER, Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'User details returned successfully.' })
    @HttpCode(404)
    @ApiResponse({ status: 404, description: 'User not found.' })
    @HttpCode(500)
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getAllUserRentals(@Param('id') userId: string): Promise<RentalDto[]> {
        return this.userService.getAllUserRentals(userId);
    }

}

