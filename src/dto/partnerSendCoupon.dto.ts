import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CouponInfoDTO } from './couponInfo.dto';
import { Type } from 'class-transformer';

export class PartnerSendCouponDTO implements Readonly<PartnerSendCouponDTO> {
  @ApiProperty({ required: false })
  @IsUUID()
  partnerId: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isWholesale: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CouponInfoDTO)
  @IsDefined()
  couponInfo: CouponInfoDTO;

  constructor(init?: Partial<PartnerSendCouponDTO>) {
    Object.assign(this, init);
  }

  public static from(dto: Partial<PartnerSendCouponDTO>): PartnerSendCouponDTO {
    const partner = new PartnerSendCouponDTO();

    for (const property in dto) {
      partner[property] = dto[property];
    }

    return partner;
  }
}
