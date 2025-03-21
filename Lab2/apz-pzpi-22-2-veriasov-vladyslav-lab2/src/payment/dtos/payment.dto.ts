import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodTypes } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class PaymentDto {
    
    @ApiProperty({
        enum: PaymentMethodTypes,
    })
    @IsEnum(PaymentMethodTypes)
    @IsNotEmpty()
    paymentMethod: PaymentMethodTypes

    @ApiProperty({
        type: String,
    })
    @IsString()
    amount: string

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