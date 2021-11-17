import { PartnerReferral } from './../../model/partnerReferrals.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerReferralsController } from './partner-referrals.controller';
import { PartnerReferralsService } from './partner-referrals.service';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerReferral])],
  controllers: [PartnerReferralsController],
  providers: [PartnerReferralsService],
})
export class PartnerReferralsModule {}
