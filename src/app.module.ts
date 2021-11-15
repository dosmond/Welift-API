import { LifterStatsModule } from './routes/lifter-stats/lifter-stats.module';
import { RolesGuard } from './auth/roles/roles.gaurd';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { AddressModule } from './routes/address/address.module';
import { AuthModule } from './auth/auth.module';
import { AcceptedLiftModule } from './routes/accepted-lift/accepted-lift.module';
import { BadgeModule } from './routes/badge/badge.module';
import { BookingModule } from './routes/booking/booking.module'
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
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
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
    TrainingVideosModule,
    NoteModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RolesGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ],
})
export class AppModule { }