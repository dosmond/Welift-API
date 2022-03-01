import { AuthModule } from './../../auth/auth.module';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { AuthService } from './../../auth/auth.service';
import { Lift } from '@src/model/lifts.entity';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { CompletedLifterBadge } from '@src/model/completedLifterBadges.entity';
import { LifterReviewsService } from './../lifter-reviews/lifter-reviews.service';
import { LifterEquipmentService } from './../lifter-equipment/lifter-equipment.service';
import { LifterCompletedTrainingVideosService } from './../lifter-completed-training-videos/lifter-completed-training-videos.service';
import { CompletedLifterBadgeService } from './../completed-lifter-badge/completed-lifter-badge.service';
import { LifterStatsService } from './../lifter-stats/lifter-stats.service';
import { AddressService } from './../address/address.service';
import { AWSS3Helper } from './../../helper/awss3.helper';
import { LifterStats } from './../../model/lifterStats.entity';
import { Address } from '@src/model/addresses.entity';
import { Lifter } from './../../model/lifters.entity';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiftersController } from './lifters.controller';
import { LiftersService } from './lifters.service';
import { PendingVerification } from '@src/model/pendingVerification.entity';
import { LifterCompletedTrainingVideo } from '@src/model/lifterCompletedTrainingVideos.entity';
import { LifterEquipment } from '@src/model/lifterEquipment.entity';
import { LifterReview } from '@src/model/lifterReviews.entity';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lifter,
      Address,
      LifterStats,
      PendingVerification,
      CompletedLifterBadge,
      LifterCompletedTrainingVideo,
      LifterEquipment,
      LifterTransaction,
      LifterReview,
      AcceptedLift,
      Lift,
    ]),
    AuthModule,
  ],
  controllers: [LiftersController],
  providers: [
    LiftersService,
    AWSS3Helper,
    AddressService,
    LifterStatsService,
    CompletedLifterBadgeService,
    LifterCompletedTrainingVideosService,
    LifterEquipmentService,
    LifterReviewsService,
    LifterTransactionsService,
    AuthService,
  ],
  exports: [LiftersService],
})
export class LiftersModule {}
