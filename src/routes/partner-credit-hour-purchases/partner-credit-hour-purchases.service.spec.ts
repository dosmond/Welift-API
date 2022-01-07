import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Partner } from '@src/model/partner.entity';
import { PartnerCreditHourPurchase } from '@src/model/partnerCreditHourPurchases.entity';
import { PartnerCreditHourPurchasesService } from './partner-credit-hour-purchases.service';

describe('PartnerCreditHourPurchasesService', () => {
  let service: PartnerCreditHourPurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([PartnerCreditHourPurchase, Partner]),
      ],
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
