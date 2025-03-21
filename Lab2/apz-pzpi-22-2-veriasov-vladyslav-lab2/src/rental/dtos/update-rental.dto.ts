import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, isBoolean } from 'class-validator';

export class UpdateRentalDto {

   @ApiProperty({
      type: Boolean,
      required: false,
   })
   @IsBoolean()
   @IsOptional()
   isActive: boolean

   @ApiProperty({
      type: String,
      required: false,
   })
   @IsString()
   @IsOptional()
   dateRented: string

   @ApiProperty({
      type: String,
      required: false,
   })
   @IsString()
   @IsOptional()
   dateReturned: string

   @ApiProperty({
      type: String,
      required: false,
   })
   @IsString()
   @IsOptional()
   userId: string

   @ApiProperty({
      type: Number,
      required: false,
   })
   @IsNumber()
   @IsOptional()
   distance: number;

   @ApiProperty({
      type: Number,
      required: false,
   })
   @IsNumber()
   @IsOptional()
   avgSpeed: number;

   @ApiProperty({
      type: Number,
      required: false,
   })
   @IsNumber()
   @IsOptional()
   maxSpeed: number;

   @ApiProperty({
      type: Number,
      required: false,
   })
   @IsNumber()
   @IsOptional()
   energyConsumed: number;
}