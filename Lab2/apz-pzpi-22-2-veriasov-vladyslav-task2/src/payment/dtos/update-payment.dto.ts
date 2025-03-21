import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodTypes } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, isBoolean } from 'class-validator';

export class UpdatePaymentDto {

    @ApiProperty({
        enum: PaymentMethodTypes,
    })
    @IsEnum(PaymentMethodTypes)
    @IsNotEmpty()
    @IsOptional()
    paymentMethod: PaymentMethodTypes

    @ApiProperty({
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    name: string

    @ApiProperty({
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    amount: string

    @ApiProperty({
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    date: string

    @ApiProperty({
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    rentalId: string;

}