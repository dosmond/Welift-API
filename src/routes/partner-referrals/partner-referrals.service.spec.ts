import { Test, TestingModule } from '@nestjs/testing';
import { PartnerReferralsService } from './partner-referrals.service';

describe('PartnerReferralsService', () => {
  let service: PartnerReferralsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerReferralsService],
    }).compile();

    service = module.get<PartnerReferralsService>(PartnerReferralsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
