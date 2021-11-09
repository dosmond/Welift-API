import { Test, TestingModule } from '@nestjs/testing';
import { PartnerCreditHourPurchasesController } from './partner-credit-hour-purchases.controller';

describe('PartnerCreditHourPurchasesController', () => {
  let controller: PartnerCreditHourPurchasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerCreditHourPurchasesController],
    }).compile();

    controller = module.get<PartnerCreditHourPurchasesController>(PartnerCreditHourPurchasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
