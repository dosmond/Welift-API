import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '@src/auth/auth.service';
import { configService } from '@src/config/config.service';
import { AWSS3Helper } from '@src/helper/awss3.helper';
import { EmailClient } from '@src/helper/email.client';
import { PushNotificationHelper } from '@src/helper/pushNotification.helper';
import { TextClient } from '@src/helper/text.client';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Address } from '@src/model/addresses.entity';
import { CompletedLifterBadge } from '@src/model/completedLifterBadges.entity';
import { LifterCompletedTrainingVideo } from '@src/model/lifterCompletedTrainingVideos.entity';
import { LifterEquipment } from '@src/model/lifterEquipment.entity';
import { LifterReview } from '@src/model/lifterReviews.entity';
import { Lifter } from '@src/model/lifters.entity';
import { LifterStats } from '@src/model/lifterStats.entity';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';
import { Lift } from '@src/model/lifts.entity';
import { PendingVerification } from '@src/model/pendingVerification.entity';
import { AcceptedLiftService } from '../accepted-lift/accepted-lift.service';
import { AddressService } from '../address/address.service';
import { CompletedLifterBadgeService } from '../completed-lifter-badge/completed-lifter-badge.service';
import { LifterCompletedTrainingVideosService } from '../lifter-completed-training-videos/lifter-completed-training-videos.service';
import { LifterEquipmentService } from '../lifter-equipment/lifter-equipment.service';
import { LifterReviewsService } from '../lifter-reviews/lifter-reviews.service';
import { LifterStatsService } from '../lifter-stats/lifter-stats.service';
import { LiftersController } from './lifters.controller';
import { LiftersService } from './lifters.service';

describe('LiftersController', () => {
  let controller: LiftersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
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
        LoggerModule.forRoot(),
      ],
      controllers: [LiftersController],
      providers: [
        LiftersService,
        TextClient,
        AWSS3Helper,
        AddressService,
        LifterStatsService,
        CompletedLifterBadgeService,
        LifterCompletedTrainingVideosService,
        LifterEquipmentService,
        LifterReviewsService,
        LifterTransactionsService,
        AcceptedLiftService,
        AuthService,
        PushNotificationHelper,
        EmailClient,
        EventEmitter2,
      ],
    }).compile();

    controller = module.get<LiftersController>(LiftersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
