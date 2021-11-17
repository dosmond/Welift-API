import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerReferral } from 'src/model/partnerReferrals.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerReferralsService {
  constructor(
    @InjectRepository(PartnerReferral)
    private readonly repo: Repository<PartnerReferral>,
  ) {}
}
