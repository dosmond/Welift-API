import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CouponInfoDTO } from './couponInfo.dto';
import { Partners } from 'src/model/Partners.entity';

export class PartnerSendCouponDTO implements Readonly<PartnerSendCouponDTO> {
  @ApiProperty({ required: false })
  @IsUUID()
  partnerId: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isWholesale: boolean;

  @ApiProperty()
  couponInfo: CouponInfoDTO;

  public static from(dto: Partial<PartnerSendCouponDTO>): PartnerSendCouponDTO {
    const partner = new PartnerSendCouponDTO();

    for (const property in dto) {
      partner[property] = dto[property];
    }

    return partner;
  }
}
