import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodTypes } from '@prisma/client';
import { Decimal, JsonValue } from '@prisma/client/runtime/library';
import { IsBoolean, IsDecimal, IsEmail, IsEnum, IsJSON, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class PaymentRentalVehicleDto {

    @ApiProperty({
        enum: PaymentMethodTypes,
    })
    @IsEnum(PaymentMethodTypes)
    @IsNotEmpty()
    paymentMethod: PaymentMethodTypes

    @ApiProperty({
        type: Decimal,
    })
    @IsDecimal()
    amount: Decimal

    @ApiProperty({
        type: String,
    })
    @IsString()
    date: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    rentalId: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    rentalVehicleId: string

    @ApiProperty({
        type: Object,
    })
    @IsJSON()
    endLocation: JsonValue
}