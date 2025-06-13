import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsBoolean, IsEmail, IsEnum, IsJSON, IsNotEmpty, IsNumber, IsString, isBoolean } from 'class-validator';

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
        type: Object,
    })
    @IsJSON()
    currentLocation: JsonValue

}