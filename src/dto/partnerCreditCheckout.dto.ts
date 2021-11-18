import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PartnerCreditCheckoutDTO
  implements Readonly<PartnerCreditCheckoutDTO>
{
  @ApiProperty()
  @IsNumber()
  hours: number;

  @ApiProperty()
  @IsNumber()
  perHourCost: string;
}
