import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { RentalDto } from './rental.dto';

export class CreateRentalDto extends RentalDto {
   @ApiProperty({
      type: String,
   })
   @IsUUID()
   id: string
}