import { Partner } from '../../model/partner.entity';
import { PartnerCreditHourPurchase } from './../../model/partnerCreditHourPurchases.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerCreditHourPurchasesController } from './partner-credit-hour-purchases.controller';
import { PartnerCreditHourPurchasesService } from './partner-credit-hour-purchases.service';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerCreditHourPurchase, Partner])],
  controllers: [PartnerCreditHourPurchasesController],
  providers: [PartnerCreditHourPurchasesService],
})
export class PartnerCreditHourPurchasesModule {}
