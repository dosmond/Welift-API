import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CouponInfoDTO implements Readonly<CouponInfoDTO> {
  @ApiProperty()
  @IsNumber()
  hours: number;

  @ApiProperty()
  customer_name: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  custom_note: string;

  @ApiProperty()
  email: string;
}
