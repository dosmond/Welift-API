import { RolesGuard } from './auth/roles/roles.gaurd';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { AcceptedLiftModule } from './accepted-lift/accepted-lift.module';
import { BadgeModule } from './badge/badge.module';
import { BookingModule } from './booking/booking.module';
import { CompletedLifterBadgeModule } from './completed-lifter-badge/completed-lifter-badge.module';
import { EquipmentModule } from './equipment/equipment.module';
import { LeadsModule } from './leads/leads.module';
import { LifterCompletedTrainingVideosModule } from './lifter-completed-training-videos/lifter-completed-training-videos.module';
import { LifterEquipmentModule } from './lifter-equipment/lifter-equipment.module';
import { LifterReviewsModule } from './lifter-reviews/lifter-reviews.module';
import { LiftersModule } from './lifters/lifters.module';
import { LiftsModule } from './lifts/lifts.module';
import { PartnerCreditHourPurchasesModule } from './partner-credit-hour-purchases/partner-credit-hour-purchases.module';
import { PartnerReferralsModule } from './partner-referrals/partner-referrals.module';
import { PartnersModule } from './partners/partners.module';
import { TrainingVideosModule } from './training-videos/training-videos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AddressModule,
    AuthModule,
    AcceptedLiftModule,
    BadgeModule,
    BookingModule,
    CompletedLifterBadgeModule,
    EquipmentModule,
    LeadsModule,
    LifterCompletedTrainingVideosModule,
    LifterEquipmentModule,
    LifterReviewsModule,
    LiftersModule,
    LiftsModule,
    PartnerCreditHourPurchasesModule,
    PartnerReferralsModule,
    PartnersModule,
    TrainingVideosModule
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule { }