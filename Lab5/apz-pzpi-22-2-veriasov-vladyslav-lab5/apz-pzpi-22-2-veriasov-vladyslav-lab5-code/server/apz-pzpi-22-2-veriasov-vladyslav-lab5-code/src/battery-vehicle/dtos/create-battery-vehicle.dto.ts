import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BatteryVehicleDto } from './battery-vehicle.dto';

export class CreateBatteryVehicleDto extends BatteryVehicleDto {
   @ApiProperty({
      type: String,
   })
   @IsUUID()
   id: string
}