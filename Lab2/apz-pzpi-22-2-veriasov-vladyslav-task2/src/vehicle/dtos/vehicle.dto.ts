import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, isBoolean } from 'class-validator';

export class VehicleDto {
    
    @ApiProperty({
        enum: VehicleStatus,
    })
    @IsEnum(VehicleStatus)
    @IsNotEmpty()
    status: VehicleStatus

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    runnedDistance: number

    @ApiProperty({
        type: String,
    })
    @IsString()
    releaseDate: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    currentLocation: string

}