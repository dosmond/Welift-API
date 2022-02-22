import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PartnerCreditHourPurchaseDTO } from '@src/dto/partnerCreditHourPurchase.dto';
import { Partner } from '@src/model/partner.entity';
import { PartnerCreditHourPurchase } from '@src/model/partnerCreditHourPurchases.entity';
import { Repository } from 'typeorm';
import { PartnerCreditHourPurchasesService } from './partner-credit-hour-purchases.service';

describe('PartnerCreditHourPurchasesService', () => {
  let service: PartnerCreditHourPurchasesService;
  let partnerRepo: Repository<Partner>;
  let purchaseRepo: Repository<PartnerCreditHourPurchase>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([PartnerCreditHourPurchase, Partner]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      providers: [PartnerCreditHourPurchasesService],
    }).compile();

    service = module.get<PartnerCreditHourPurchasesService>(
      PartnerCreditHourPurchasesService,
    );
    partnerRepo = module.get(getRepositoryToken(Partner));
    purchaseRepo = module.get(getRepositoryToken(PartnerCreditHourPurchase));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPurchase', () => {
    let partner: Partner;

    beforeAll(async () => {
      partner = await setup();
    });

    it('should update the partner hours and create a purchase row', async () => {
      await service.createPurchase(
        null,
        new PartnerCreditHourPurchaseDTO({
          stripeSessionId: '324234234234',
          creditsPurchased: 10,
          totalCost: 100,
          partnerId: partner.id,
        }),
      );

      const updatedPartner = await partnerRepo.findOne({ id: partner.id });
      expect(updatedPartner.totalCredits).toEqual(partner.totalCredits + 10);
      const purchases = await purchaseRepo.find();
      expect(purchases.length).toEqual(1);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const setup = async () => {
    const createdPartner = await partnerRepo.save(
      new Partner({
        companyName: 'Test',
        email: 'test@test.com',
        totalCredits: 500,
        phone: '8015555555',
      }),
    );

    return createdPartner;
  };

  const cleanUp = async () => {
    const purchases = await purchaseRepo.find();
    for (const purchase of purchases) {
      await purchaseRepo.delete({ id: purchase.id });
    }

    const partners = await partnerRepo.find();
    for (const partner of partners) {
      await partnerRepo.delete({ id: partner.id });
    }
  };
});
