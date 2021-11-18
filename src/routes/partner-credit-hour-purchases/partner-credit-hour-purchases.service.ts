import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerCreditHourPurchaseDTO } from 'src/dto/partnerCreditHourPurchase.dto';
import { PartnerCreditHourPurchase } from 'src/model/partnerCreditHourPurchases.entity';
import { Partners } from 'src/model/Partners.entity';
import { User } from 'src/user.decorator';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerCreditHourPurchasesService {
  constructor(
    @InjectRepository(PartnerCreditHourPurchase)
    private readonly partnerRepo: Repository<Partners>,
    private readonly repo: Repository<PartnerCreditHourPurchase>,
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

    await this.repo.save(partner);

    await PartnerCreditHourPurchaseDTO.fromEntity(
      await this.repo.save(partnerCreditPurchase.toEntity(user)),
    );
  }
}
