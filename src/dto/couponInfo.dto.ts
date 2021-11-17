import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CouponInfoDTO implements Readonly<CouponInfoDTO> {
  @ApiProperty()
  @IsNumber()
  hours: number;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  businessName: string;

  @ApiProperty()
  customNote: string;

  @ApiProperty()
  email: string;
}
