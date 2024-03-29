import { LifterTransactionsModule } from './routes/lifter-transactions/lifter-transactions.module';
import { TextModule } from './helper/text.client';
import { PushNotificationModule } from './helper/pushNotification.helper';
import { EmailModule } from './helper/email.client';
import { CronModule } from './helper/cron.helper';
import { BookingLocationCountModule } from './routes/booking-location-count/bookingLocationCount.module';
import { CheckrModule } from './routes/checkr/checkr.module';
import { SurveyResponseModule } from './routes/survey-response/survey-response.module';
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
import { SurveyModule } from './routes/survey/survey.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WhatsNewModule } from './routes/whats-new/whats-new.module';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { BankingModule } from './routes/banking/banking.module';

import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      maxListeners: 1,
      verboseMemoryLeak: true,
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        useLevel: 'error',
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            singleLine: true,
            translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
          },
        },
      },
    }),
    AddressModule,
    AuthModule,
    AcceptedLiftModule,
    BadgeModule,
    BookingModule,
    BookingLocationCountModule,
    CompletedLifterBadgeModule,
    CheckrModule,
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
    PushNotificationModule,
    SurveyModule,
    SurveyResponseModule,
    TrainingVideosModule,
    NoteModule,
    CronModule,
    EmailModule,
    WhatsNewModule,
    TextModule,
    LifterTransactionsModule,
    BankingModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
