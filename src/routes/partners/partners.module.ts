import { AuthModule } from './../../auth/auth.module';
import { Partner } from '../../model/partner.entity';
import { PartnerReferral } from './../../model/partnerReferrals.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerReferral, Partner]), AuthModule],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class PartnersModule {}
