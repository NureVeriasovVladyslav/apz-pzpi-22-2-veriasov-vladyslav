import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, isBoolean } from 'class-validator';

export class UpdateUserDto {

   @ApiProperty({
      type: String,
      required: false,
   })
   @IsEmail()
   @IsOptional()
   email: string


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
   password: string

   @ApiProperty({
      type: String,
      required: false,
   })
   @IsString()
   @IsOptional()
   phoneNumber: string



   @ApiProperty({
      type: String,
      required: false,
   })
   @IsString()
   @IsOptional()
   bonusAccount: string;

   @ApiProperty({
      type: String,
      required: false,
   })
   @IsString()
   @IsOptional()
   photo: string


   @ApiProperty({
      type: Boolean,
      required: false,
   })
   @IsBoolean()
   @IsOptional()
   notification: boolean

   @ApiProperty({
      enum: Role,
   })
   @IsEnum(Role)
   @IsNotEmpty()
   @IsOptional()
   role: Role

}