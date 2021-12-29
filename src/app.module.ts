import { SurveyResponseModule } from './routes/survey-response/survey-response.module';
import { AuthService } from './auth/auth.service';
import { Lift } from 'src/model/lifts.entity';
import { AcceptedLiftService } from './routes/accepted-lift/accepted-lift.service';
import { EmailClient } from 'src/helper/email.client';
import { Address } from 'src/model/addresses.entity';
import { LifterStats } from 'src/model/lifterStats.entity';
import { Lifter } from 'src/model/lifters.entity';
import { AWSS3Helper } from './helper/awss3.helper';
import { TextClient } from './helper/text.client';
import { LiftersService } from './routes/lifters/lifters.service';
import { BookingLocationCount } from './model/bookingLocationCount.entity';
import { BookingLocationCountService } from './routes/booking-location-count/bookingLocationCount.service';
import { PushNotificationHelper } from './helper/pushNotification.helper';
import { CronHelper } from './helper/cron.helper';
import { LifterStatsModule } from './routes/lifter-stats/lifter-stats.module';
import { RolesGuard } from './auth/roles/roles.gaurd';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { AddressModule } from './routes/address/address.module';
import { AuthModule } from './auth/auth.module';
import { AcceptedLiftModule } from './routes/accepted-lift/accepted-lift.module';
import { BadgeModule } from './routes/badge/badge.module';
import { BookingModule } from './routes/booking/booking.module';
import { CompletedLifterBadgeModule } from './routes/completed-lifter-badge/completed-lifter-badge.module';
import { EquipmentModule } from './routes/equipment/equipment.module';
import { LeadsModule } from './routes/leads/leads.module';
import { LifterCompletedTrainingVideosModule } from './routes/lifter-completed-training-videos/lifter-completed-training-videos.module';
import { LifterEquipmentModule } from './routes/lifter-equipment/lifter-equipment.module';
import { LifterReviewsModule } from './routes/lifter-reviews/lifter-reviews.module';
import { LiftersModule } from './routes/lifters/lifters.module';
import { LiftsModule } from './routes/lifts/lifts.module';
import { PartnerCreditHourPurchasesModule } from './routes/partner-credit-hour-purchases/partner-credit-hour-purchases.module';
import { PartnerReferralsModule } from './routes/partner-referrals/partner-referrals.module';
import { PartnersModule } from './routes/partners/partners.module';
import { TrainingVideosModule } from './routes/training-videos/training-videos.module';
import { NoteModule } from './routes/note/note.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PendingVerification } from './model/pendingVerification.entity';
import { LifterReviewsService } from './routes/lifter-reviews/lifter-reviews.service';
import { AddressService } from './routes/address/address.service';
import { CompletedLifterBadgeService } from './routes/completed-lifter-badge/completed-lifter-badge.service';
import { LifterCompletedTrainingVideosService } from './routes/lifter-completed-training-videos/lifter-completed-training-videos.service';
import { LifterEquipmentService } from './routes/lifter-equipment/lifter-equipment.service';
import { LifterStatsService } from './routes/lifter-stats/lifter-stats.service';
import { CompletedLifterBadge } from './model/completedLifterBadges.entity';
import { LifterCompletedTrainingVideo } from './model/lifterCompletedTrainingVideos.entity';
import { LifterEquipment } from './model/lifterEquipment.entity';
import { LifterReview } from './model/lifterReviews.entity';
import { AcceptedLift } from './model/acceptedLift.entity';
import { SurveyModule } from './routes/survey/survey.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([
      Address,
      BookingLocationCount,
      Lifter,
      LifterStats,
      PendingVerification,
      CompletedLifterBadge,
      LifterCompletedTrainingVideo,
      LifterEquipment,
      LifterReview,
      AcceptedLift,
      Lift,
    ]),
    ScheduleModule.forRoot(),
    CacheModule.register(),
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
    LifterStatsModule,
    LiftersModule,
    LiftsModule,
    PartnerCreditHourPurchasesModule,
    PartnerReferralsModule,
    PartnersModule,
    SurveyModule,
    SurveyResponseModule,
    TrainingVideosModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RolesGuard,
    CronHelper,
    PushNotificationHelper,
    BookingLocationCountService,
    TextClient,
    AWSS3Helper,
    LiftersService,
    EmailClient,
    AddressService,
    LifterStatsService,
    CompletedLifterBadgeService,
    LifterCompletedTrainingVideosService,
    LifterEquipmentService,
    LifterReviewsService,
    AcceptedLiftService,
    AuthService,
  ],
})
export class AppModule {}
