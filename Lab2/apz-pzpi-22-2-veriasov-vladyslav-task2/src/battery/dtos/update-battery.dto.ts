import { ApiProperty } from '@nestjs/swagger';
import { BatteryStatus } from '@prisma/client';
import { BatteryType } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, isBoolean } from 'class-validator';

export class UpdateBatteryDto {

    @ApiProperty({
        type: Number,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    chargeLevel: number

    @ApiProperty({
        enum: BatteryStatus,
    })
    @IsEnum(BatteryStatus)
    @IsNotEmpty()
    @IsOptional()
    status: BatteryStatus

    @ApiProperty({
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    condition: string

    @ApiProperty({
        enum: BatteryType,
    })
    @IsEnum(BatteryType)
    @IsNotEmpty()
    @IsOptional()
    type: BatteryType

    @ApiProperty({
        type: Number,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    capacity: number

}