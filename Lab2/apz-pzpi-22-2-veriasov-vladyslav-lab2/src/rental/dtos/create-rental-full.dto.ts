import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { RentalDto } from './rental.dto';
import { RentalFullDto } from './rental-full.dto';

export class CreateRentalFullDto extends RentalFullDto {
   @ApiProperty({
      type: String,
   })
   @IsUUID()
   id: string
}