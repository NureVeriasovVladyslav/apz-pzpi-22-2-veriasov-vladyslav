import { ApiProperty } from '@nestjs/swagger';
import { Role, PaymentMethodTypes, VehicleStatus } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, IsArray } from 'class-validator';

export class RentalVehicleDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  vehicleId: string;

  @ApiProperty({ type: String })
  @IsString()
  rentalId: string;
}

export class PaymentDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ enum: PaymentMethodTypes })
  @IsEnum(PaymentMethodTypes)
  paymentMethod: PaymentMethodTypes;

  @ApiProperty({ type: String })
  @IsString()
  amount: string;

  @ApiProperty({ type: String })
  @IsString()
  date: string;
}

export class RentalDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ type: String })
  @IsString()
  dateRented: string;

  @ApiProperty({ type: String })
  @IsString()
  dateReturned: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  distance: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  avgSpeed: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  maxSpeed: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  energyConsumed: number;

  @ApiProperty({ type: [RentalVehicleDto] })
  @IsArray()
  rentalVehicle: RentalVehicleDto[];

  @ApiProperty({ type: PaymentDto })
  payment: PaymentDto | null;
}

export class UserDto {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ type: String })
  @IsString()
  bonusAccount: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  notification: boolean;

  @ApiProperty({ type: String })
  @IsString()
  photo: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({ type: [RentalDto] })
  @IsArray()
  rental: RentalDto[];
}
