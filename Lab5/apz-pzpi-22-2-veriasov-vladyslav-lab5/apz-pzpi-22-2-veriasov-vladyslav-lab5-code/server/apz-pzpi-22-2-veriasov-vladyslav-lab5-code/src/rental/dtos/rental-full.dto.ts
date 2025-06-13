import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsBoolean, IsEmail, IsEnum, IsJSON, IsNotEmpty, IsNumber, IsString, isBoolean, isNumber } from 'class-validator';

export class RentalFullDto {

    @ApiProperty({
        type: Boolean,
    })
    @IsBoolean()
    isActive: boolean

    @ApiProperty({
        type: String,
    })
    @IsString()
    dateRented: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    dateReturned: string

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    distance: number

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    avgSpeed: number

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    maxSpeed: number

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    energyConsumed: number

    @ApiProperty({
        type: String,
    })
    @IsString()
    userId: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    vehicleId: string

    @ApiProperty({
        type: Object,
    })
    @IsJSON()
    startLocation: JsonValue

    // @ApiProperty({
    //     type: Object,
    // })
    // @IsJSON()
    // endLocation: JsonValue
}