import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber } from 'class-validator';
import { User } from '@src/user.decorator';

export class PartnerCreditHourPurchaseDTO
  implements Readonly<PartnerCreditHourPurchaseDTO>
{
  @ApiProperty()
  @IsUUID()
  stripeSessionId: string;

  @ApiProperty()
  @IsNumber()
  creditsPurchased: number;

  @ApiProperty()
  @IsNumber()
  totalCost: number;

  @ApiProperty()
  @IsUUID()
  partnerId: string;

  public static from(
    dto: Partial<PartnerCreditHourPurchaseDTO>,
  ): PartnerCreditHourPurchaseDTO {
    const partnerCreditPurchase = new PartnerCreditHourPurchaseDTO();
    partnerCreditPurchase.stripeSessionId = dto.stripeSessionId;
    partnerCreditPurchase.creditsPurchased = dto.creditsPurchased;
    partnerCreditPurchase.totalCost = dto.totalCost;
    partnerCreditPurchase.partnerId = dto.partnerId;
    return partnerCreditPurchase;
  }

  public static fromEntity(
    entity: PartnerCreditHourPurchaseDTO,
  ): PartnerCreditHourPurchaseDTO {
    if (entity) {
      return this.from({
        stripeSessionId: entity.stripeSessionId,
        creditsPurchased: entity.creditsPurchased,
        totalCost: entity.totalCost,
        partnerId: entity.partnerId,
      });
    }
    return null;
  }

  public toEntity(user: User = null): PartnerCreditHourPurchaseDTO {
    const partnerCreditPurchase = new PartnerCreditHourPurchaseDTO();
    for (const property in this as PartnerCreditHourPurchaseDTO) {
      partnerCreditPurchase[property] = this[property];
    }
    return partnerCreditPurchase;
  }
}
