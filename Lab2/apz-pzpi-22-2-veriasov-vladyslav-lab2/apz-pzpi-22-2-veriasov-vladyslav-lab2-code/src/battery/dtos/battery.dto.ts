import { ApiProperty } from '@nestjs/swagger';
import { BatteryStatus } from '@prisma/client';
import { BatteryType } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, isBoolean } from 'class-validator';

export class BatteryDto {
    
    @ApiProperty({
        enum: BatteryStatus,
    })
    @IsEnum(BatteryStatus)
    @IsNotEmpty()
    status: BatteryStatus

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    chargeLevel: number

    @ApiProperty({
        type: String,
    })
    @IsString()
    condition: string

    @ApiProperty({
        enum: BatteryType,
    })
    @IsEnum(BatteryType)
    @IsNotEmpty()
    type: BatteryType

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    capacity: number

}