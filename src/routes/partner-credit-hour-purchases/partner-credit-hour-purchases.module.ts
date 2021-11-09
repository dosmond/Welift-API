import { Module } from '@nestjs/common';
import { PartnerCreditHourPurchasesController } from './partner-credit-hour-purchases.controller';
import { PartnerCreditHourPurchasesService } from './partner-credit-hour-purchases.service';

@Module({
  controllers: [PartnerCreditHourPurchasesController],
  providers: [PartnerCreditHourPurchasesService]
})
export class PartnerCreditHourPurchasesModule {}
