import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerCreditHourPurchaseDTO } from '@src/dto/partnerCreditHourPurchase.dto';
import { PartnerCreditHourPurchase } from '@src/model/partnerCreditHourPurchases.entity';
import { Partner } from '@src/model/partner.entity';
import { User } from '@src/user.decorator';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerCreditHourPurchasesService {
  constructor(
    @InjectRepository(PartnerCreditHourPurchase)
    private readonly repo: Repository<PartnerCreditHourPurchase>,
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
  ) {}

  public async createPurchase(
    user: User,
    request: PartnerCreditHourPurchaseDTO,
  ): Promise<void> {
    const partnerCreditPurchase = PartnerCreditHourPurchaseDTO.from(request);
    const partner = await this.partnerRepo.findOne({
      id: partnerCreditPurchase.partnerId,
    });

    partner.totalCredits += partnerCreditPurchase.creditsPurchased;

    await this.partnerRepo.save(partner);
    await this.repo.save(partnerCreditPurchase.toEntity(user));
  }
}
