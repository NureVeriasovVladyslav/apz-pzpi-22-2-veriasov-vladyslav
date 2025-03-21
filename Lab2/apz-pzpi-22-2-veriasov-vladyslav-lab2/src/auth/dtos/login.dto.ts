import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class LoginDto {

    @ApiProperty({
        type: String,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    password: string

}