import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { User } from '@src/user.decorator';

export class PartnerReferralDTO implements Readonly<PartnerReferralDTO> {
  @ApiProperty()
  @IsUUID()
  partnerId: string;

  @ApiProperty()
  @IsUUID()
  bookingId: string;

  public static from(dto: Partial<PartnerReferralDTO>): PartnerReferralDTO {
    const partnerReferral = new PartnerReferralDTO();
    partnerReferral.partnerId = dto.partnerId;
    partnerReferral.bookingId = dto.bookingId;
    return partnerReferral;
  }

  public static fromEntity(entity: PartnerReferralDTO): PartnerReferralDTO {
    if (entity) {
      return this.from({
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
