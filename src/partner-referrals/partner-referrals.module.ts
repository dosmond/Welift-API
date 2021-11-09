import { Module } from '@nestjs/common';
import { PartnerReferralsController } from './partner-referrals.controller';

@Module({
  controllers: [PartnerReferralsController]
})
export class PartnerReferralsModule {}
