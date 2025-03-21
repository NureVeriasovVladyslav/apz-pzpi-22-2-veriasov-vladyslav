import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { RentalVehicleDto } from './rental-vehicle.dto';

export class CreateRentalVehicleDto extends RentalVehicleDto {
   @ApiProperty({
      type: String,
   })
   @IsUUID()
   id: string
}