import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { User } from '@src/user.decorator';

export class PartnerReferralDTO implements Readonly<PartnerReferralDTO> {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  partnerId: string;

  @ApiProperty()
  @IsUUID()
  bookingId: string;

  constructor(init?: Partial<PartnerReferralDTO>) {
    Object.assign(this, init);
  }

  public static from(dto: Partial<PartnerReferralDTO>): PartnerReferralDTO {
    const partnerReferral = new PartnerReferralDTO();
    partnerReferral.id = dto.id;
    partnerReferral.partnerId = dto.partnerId;
    partnerReferral.bookingId = dto.bookingId;
    return partnerReferral;
  }

  public static fromEntity(entity: PartnerReferralDTO): PartnerReferralDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        partnerId: entity.partnerId,
        bookingId: entity.bookingId,
      });
    }
    return null;
  }

  public toEntity(user: User = null): PartnerReferralDTO {
    const partnerReferral = new PartnerReferralDTO();
    for (const property in this as PartnerReferralDTO) {
      partnerReferral[property] = this[property];
    }
    return partnerReferral;
  }
}
