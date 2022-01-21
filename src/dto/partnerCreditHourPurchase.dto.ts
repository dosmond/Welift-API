import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsString } from 'class-validator';
import { User } from '@src/user.decorator';
import { PartnerCreditHourPurchase } from '@src/model/partnerCreditHourPurchases.entity';

export class PartnerCreditHourPurchaseDTO
  implements Readonly<PartnerCreditHourPurchaseDTO>
{
  @ApiProperty()
  @IsString()
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

  constructor(init?: Partial<PartnerCreditHourPurchaseDTO>) {
    Object.assign(this, init);
  }

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

  public toEntity(user: User = null): PartnerCreditHourPurchase {
    const partnerCreditPurchase = new PartnerCreditHourPurchase();
    for (const property in this as PartnerCreditHourPurchaseDTO) {
      partnerCreditPurchase[property] = this[property];
    }
    return partnerCreditPurchase;
  }
}
