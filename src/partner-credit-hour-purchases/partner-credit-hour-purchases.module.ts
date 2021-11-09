import { Module } from '@nestjs/common';
import { PartnerCreditHourPurchasesController } from './partner-credit-hour-purchases.controller';

@Module({
  controllers: [PartnerCreditHourPurchasesController]
})
export class PartnerCreditHourPurchasesModule {}
