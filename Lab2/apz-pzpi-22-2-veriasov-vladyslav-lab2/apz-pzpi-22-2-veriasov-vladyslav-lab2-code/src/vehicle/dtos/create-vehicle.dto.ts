import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { VehicleDto } from './vehicle.dto';

export class CreateVehicleDto extends VehicleDto {
   @ApiProperty({
      type: String,
   })
   @IsUUID()
   id: string
}