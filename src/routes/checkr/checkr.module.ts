import { PushNotificationHelper } from './../../helper/pushNotification.helper';
import { Lifter } from 'src/model/lifters.entity';
import { LiftersService } from './../lifters/lifters.service';
import { CheckrService } from './checkr.service';
import { CheckrController } from './checkr.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AWSS3Helper } from 'src/helper/awss3.helper';
import { TextClient } from 'src/helper/text.client';
import { AcceptedLiftService } from '../accepted-lift/accepted-lift.service';
import { AddressService } from '../address/address.service';
import { CompletedLifterBadgeService } from '../completed-lifter-badge/completed-lifter-badge.service';
import { LifterCompletedTrainingVideosService } from '../lifter-completed-training-videos/lifter-completed-training-videos.service';
import { LifterEquipmentService } from '../lifter-equipment/lifter-equipment.service';
import { LifterReviewsService } from '../lifter-reviews/lifter-reviews.service';
import { LifterStatsService } from '../lifter-stats/lifter-stats.service';
import { AcceptedLift } from 'src/model/acceptedLift.entity';
import { Address } from 'src/model/addresses.entity';
import { CompletedLifterBadge } from 'src/model/completedLifterBadges.entity';
import { LifterCompletedTrainingVideo } from 'src/model/lifterCompletedTrainingVideos.entity';
import { LifterEquipment } from 'src/model/lifterEquipment.entity';
import { LifterReview } from 'src/model/lifterReviews.entity';
import { LifterStats } from 'src/model/lifterStats.entity';
import { Lift } from 'src/model/lifts.entity';
import { PendingVerification } from 'src/model/pendingVerification.entity';

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
      LifterReview,
      AcceptedLift,
      Lift,
    ]),
  ],
  controllers: [CheckrController],
  providers: [
    CheckrService,
    LiftersService,
    TextClient,
    AWSS3Helper,
    AddressService,
    LifterStatsService,
    CompletedLifterBadgeService,
    LifterCompletedTrainingVideosService,
    LifterEquipmentService,
    LifterReviewsService,
    AcceptedLiftService,
    AuthService,
    PushNotificationHelper,
  ],
})
export class CheckrModule {}
