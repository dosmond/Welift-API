import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CouponInfoDTO } from './couponInfo.dto';

export class CheckoutSessionDTO implements Readonly<CheckoutSessionDTO> {
  @ApiProperty()
  cancelUrl: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  @IsUUID()
  id: string;
}
