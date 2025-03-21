import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodTypes } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class BatteryVehicleDto {
    
    @ApiProperty({
        type: String,
    })
    @IsString()
    vehicleId: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    batteryId: string

}