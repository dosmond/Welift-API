import { Test, TestingModule } from '@nestjs/testing';
import { PartnerCreditHourPurchasesService } from './partner-credit-hour-purchases.service';

describe('PartnerCreditHourPurchasesService', () => {
  let service: PartnerCreditHourPurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerCreditHourPurchasesService],
    }).compile();

    service = module.get<PartnerCreditHourPurchasesService>(
      PartnerCreditHourPurchasesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
