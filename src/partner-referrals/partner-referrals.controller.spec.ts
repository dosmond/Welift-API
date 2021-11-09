import { Test, TestingModule } from '@nestjs/testing';
import { PartnerReferralsController } from './partner-referrals.controller';

describe('PartnerReferralsController', () => {
  let controller: PartnerReferralsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerReferralsController],
    }).compile();

    controller = module.get<PartnerReferralsController>(PartnerReferralsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
