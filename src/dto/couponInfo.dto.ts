import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CouponInfoDTO implements Readonly<CouponInfoDTO> {
  @ApiProperty()
  @IsNumber()
  hours: number;

  @ApiProperty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsString()
  customNote: string;

  @ApiProperty()
  @IsString()
  email: string;

  constructor(init?: Partial<CouponInfoDTO>) {
    Object.assign(this, init);
  }
}
