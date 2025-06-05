import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BatteryDto } from './battery.dto';

export class CreateBatteryDto extends BatteryDto {
   @ApiProperty({
      type: String,
   })
   @IsUUID()
   id: string
}