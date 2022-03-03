import { CronHelper, CronModule } from './../../helper/cron.helper';
import { SlackHelper } from '@src/helper/slack.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
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
import axios from 'axios';
import { Repository } from 'typeorm';
import { AcceptedLiftService } from '../accepted-lift/accepted-lift.service';
import { AddressService } from '../address/address.service';
import { CompletedLifterBadgeService } from '../completed-lifter-badge/completed-lifter-badge.service';
import { LifterCompletedTrainingVideosService } from '../lifter-completed-training-videos/lifter-completed-training-videos.service';
import { LifterEquipmentService } from '../lifter-equipment/lifter-equipment.service';
import { LifterReviewsService } from '../lifter-reviews/lifter-reviews.service';
import { LifterStatsService } from '../lifter-stats/lifter-stats.service';
import { LiftersService } from '../lifters/lifters.service';
import { CheckrService } from './checkr.service';
import { ScheduleModule } from '@nestjs/schedule';

describe('CheckrService', () => {
  let module: TestingModule;
  let service: CheckrService;
  let lifterRepo: Repository<Lifter>;
  let addressRepo: Repository<Address>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([
          Lifter,
          Address,
          LifterStats,
          PendingVerification,
          CompletedLifterBadge,
          LifterTransaction,
          LifterCompletedTrainingVideo,
          LifterEquipment,
          LifterReview,
          AcceptedLift,
          Lift,
        ]),
        AuthModule,
        CronModule,
        ScheduleModule.forRoot(),
        LoggerModule.forRoot(),
      ],
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
        LifterTransactionsService,
        AcceptedLiftService,
        AuthService,
        PushNotificationHelper,
        EmailClient,
        EventEmitter2,
        SlackHelper,
      ],
    }).compile();

    service = module.get<CheckrService>(CheckrService);
    lifterRepo = module.get(getRepositoryToken(Lifter));
    addressRepo = module.get(getRepositoryToken(Address));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleBcWebhook', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      lifter = await setup();
    });

    it('should properly update the lifter on a clean report', async () => {
      jest.spyOn(axios, 'get').mockImplementation(async () => {
        return {
          data: {
            metadata: {
              userId: lifter.userId,
            },
          },
        };
      });

      await service.handleBcWebhook({
        type: 'report.completed',
        data: {
          object: {
            status: 'clear',
          },
        },
      });

      expect(axios.get).toHaveBeenCalled();

      const newLifter = await lifterRepo.findOne({ id: lifter.id });

      expect(newLifter.passedBc).toBeTruthy();
      expect(newLifter.bcInProgress).toBeTruthy();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  afterAll(() => {
    module.close();
  });

  const setup = async () => {
    const lifter = new Lifter({
      firstName: 'test',
      lastName: 'test',
      phone: '8015555555',
      passedBc: false,
      bcInProgress: false,
      email: 'test@test.com',
      hasPickupTruck: true,
      status: 'contacted',
      userId: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
      addressId: (
        await addressRepo.save(
          new Address({
            street: 'test1',
            street2: 'test1',
            city: 'city',
            state: 'state',
            postalCode: 'postalCode',
          }),
        )
      ).id,
    });
    return await lifterRepo.save(lifter);
  };

  const cleanUp = async () => {
    const lifters = await lifterRepo.find();

    for (const lifter of lifters) {
      await lifterRepo.delete({ id: lifter.id });
    }

    const addresses = await addressRepo.find();

    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }
  };
});
