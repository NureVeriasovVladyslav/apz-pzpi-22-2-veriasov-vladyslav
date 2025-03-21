import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class UserDto {

    @ApiProperty({
        type: String,
    })
    @IsEmail()
    email: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    name: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    password: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    phoneNumber: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    bonusAccount: string

    @ApiProperty({
        type: Boolean,
    })
    @IsBoolean()
    notification: boolean

    @ApiProperty({
        type: String,
    })
    @IsString()
    photo: string
    
    @ApiProperty({
        enum: Role
    })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role
    id: any;
}