import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodTypes } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IsBoolean, IsDecimal, IsEmail, IsEnum, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class PaymentDto {
    
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

}