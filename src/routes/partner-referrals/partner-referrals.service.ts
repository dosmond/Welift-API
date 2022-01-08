import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerReferralDTO } from '@src/dto/partnerReferral.dto';
import { PartnerReferral } from '@src/model/partnerReferrals.entity';
import { User } from '@src/user.decorator';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerReferralsService {
  constructor(
    @InjectRepository(PartnerReferral)
    private readonly repo: Repository<PartnerReferral>,
  ) {}

  public async addPartnerReferral(
    user: User,
    request: PartnerReferralDTO,
  ): Promise<PartnerReferralDTO> {
    const partnerReferral = PartnerReferralDTO.from(request);
    return PartnerReferralDTO.fromEntity(
      await this.repo.save(partnerReferral.toEntity(user)),
    );
  }
}
