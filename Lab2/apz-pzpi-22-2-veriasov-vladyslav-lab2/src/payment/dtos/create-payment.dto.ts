import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaymentDto } from './payment.dto';

export class CreatePaymentDto extends PaymentDto {
   @ApiProperty({
      type: String,
   })
   @IsUUID()
   id: string
}