import { Module } from '@nestjs/common';
import { PartnerReferralsController } from './partner-referrals.controller';
import { PartnerReferralsService } from './partner-referrals.service';

@Module({
  controllers: [PartnerReferralsController],
  providers: [PartnerReferralsService]
})
export class PartnerReferralsModule {}
