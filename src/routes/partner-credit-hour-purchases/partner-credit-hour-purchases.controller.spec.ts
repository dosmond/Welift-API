import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Partner } from '@src/model/partner.entity';
import { PartnerCreditHourPurchase } from '@src/model/partnerCreditHourPurchases.entity';
import { PartnerCreditHourPurchasesController } from './partner-credit-hour-purchases.controller';
import { PartnerCreditHourPurchasesService } from './partner-credit-hour-purchases.service';

describe('PartnerCreditHourPurchasesController', () => {
  let controller: PartnerCreditHourPurchasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([PartnerCreditHourPurchase, Partner]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      controllers: [PartnerCreditHourPurchasesController],
      providers: [PartnerCreditHourPurchasesService],
    }).compile();

    controller = module.get<PartnerCreditHourPurchasesController>(
      PartnerCreditHourPurchasesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
