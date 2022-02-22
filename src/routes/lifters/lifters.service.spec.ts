import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { AddressUpdateDTO } from './../../dto/address.update.dto';
import { LifterUpdateDTO } from './../../dto/lifter.update.dto';
import { PendingVerificationDTO } from './../../dto/pendingVerification.dto';
import { LifterBatchDTO } from '@src/dto/lifter.batch.dto';
import { LifterDTO } from './../../dto/lifter.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '@src/auth/auth.service';
import { configService } from '@src/config/config.service';
import { AddressDTO } from '@src/dto/address.dto';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { Order } from '@src/enum/order.enum';
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
import { Lift } from '@src/model/lifts.entity';
import { PendingVerification } from '@src/model/pendingVerification.entity';
import { Repository } from 'typeorm';
import { AcceptedLiftService } from '../accepted-lift/accepted-lift.service';
import { AddressService } from '../address/address.service';
import { CompletedLifterBadgeService } from '../completed-lifter-badge/completed-lifter-badge.service';
import { LifterCompletedTrainingVideosService } from '../lifter-completed-training-videos/lifter-completed-training-videos.service';
import { LifterEquipmentService } from '../lifter-equipment/lifter-equipment.service';
import { LifterReviewsService } from '../lifter-reviews/lifter-reviews.service';
import { LifterStatsService } from '../lifter-stats/lifter-stats.service';
import { LiftersService } from './lifters.service';
import { ConflictException } from '@nestjs/common';
import { LifterUpdateBatchDTO } from '@src/dto/lifter.update.batch.dto';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';
import { Booking } from '@src/model/booking.entity';

describe('LiftersService', () => {
  let service: LiftersService;
  let lifterRepo: Repository<Lifter>;
  let addressRepo: Repository<Address>;
  let statsRepo: Repository<LifterStats>;
  let pendingRepo: Repository<PendingVerification>;
  let bookingRepo: Repository<Booking>;
  let liftRepo: Repository<Lift>;
  let acceptedLiftRepo: Repository<AcceptedLift>;
  let textClient: TextClient;
  let emailClient: EmailClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([
          Booking,
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
      ],
    }).compile();

    service = module.get<LiftersService>(LiftersService);
    lifterRepo = module.get(getRepositoryToken(Lifter));
    addressRepo = module.get(getRepositoryToken(Address));
    statsRepo = module.get(getRepositoryToken(LifterStats));
    pendingRepo = module.get(getRepositoryToken(PendingVerification));
    bookingRepo = module.get(getRepositoryToken(Booking));
    liftRepo = module.get(getRepositoryToken(Lift));
    acceptedLiftRepo = module.get(getRepositoryToken(AcceptedLift));
    textClient = module.get<TextClient>(TextClient);
    emailClient = module.get<EmailClient>(EmailClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      lifter = await setup();
    });

    it('should get the correct lifter', async () => {
      const gotLifter = await service.getById(null, lifter.id);
      expect(lifter.id).toEqual(gotLifter.id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getByUserId', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      lifter = await setup();
    });

    it('should get the correct lifter', async () => {
      const gotLifter = await service.getByUserId(null, lifter.userId);
      expect(lifter.userId).toEqual(gotLifter.userId);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAllNotPassedBc', () => {
    beforeAll(async () => {
      await setupMultiple();
    });

    it('should get all lifters that have not passed their bc', async () => {
      const gotLifters = await service.getAllNotPassedBc();
      expect(gotLifters.length).toEqual(1);
      expect(gotLifters[0].passedBc).toBeFalsy();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAllNotPassedBc', () => {
    beforeAll(async () => {
      await setupMultiple();
    });

    it('should get all lifters flagged for deletion', async () => {
      const gotLifters = await service.getLiftersFlaggedForDeletion();
      expect(gotLifters.length).toEqual(1);
      expect(gotLifters[0].deletionPending).toBeTruthy();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await setupMultiple();
    });

    it('should get all lifters when no params are sent', async () => {
      const gotLifters = await service.getAll(new PaginatedDTO());
      expect(gotLifters.length).toEqual(2);
    });

    it('should get correct lifters when start is given', async () => {
      const gotLifters = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(gotLifters.length).toEqual(1);
    });

    it('should return correct lifters when start and end are given', async () => {
      const gotLifters = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 10:35:00+00'),
          end: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(gotLifters.length).toEqual(1);
    });

    it('should return in the correct order: default (DESC)', async () => {
      const gotLifters = await service.getAll(new PaginatedDTO());
      expect(
        new Date(gotLifters[0].creationDate) >
          new Date(gotLifters[1].creationDate),
      ).toBeTruthy();
    });

    it('should return in the correct order: (ASC)', async () => {
      const gotLifters = await service.getAll(
        new PaginatedDTO({
          order: Order.ASC,
        }),
      );
      expect(
        new Date(gotLifters[0].creationDate) <
          new Date(gotLifters[1].creationDate),
      ).toBeTruthy();
    });

    it('should return correct pages', async () => {
      const liftersPageOne = await service.getAll(
        new PaginatedDTO({
          page: 1,
          pageSize: 1,
        }),
      );

      expect(liftersPageOne.length).toEqual(1);
      const liftersPageTwo = await service.getAll(
        new PaginatedDTO({
          page: 2,
          pageSize: 1,
        }),
      );
      expect(liftersPageTwo.length).toEqual(1);
      expect(liftersPageOne[0].id).not.toEqual(liftersPageTwo[0].id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getUniqueLifterCount', () => {
    beforeAll(async () => {
      await createTwoBookingsAndAssignOneLifterToEach();
    });

    it('should return the correct amount of unique lifters when no params given', async () => {
      expect(await service.getUniqueLifterCount(new PaginatedDTO())).toEqual(2);
    });

    it('should return the correct amount when start is given', async () => {
      expect(
        await service.getUniqueLifterCount(
          new PaginatedDTO({
            start: new Date('2022-01-05 20:35:00+00'),
          }),
        ),
      ).toEqual(1);
    });

    it('should return the correct amount when start and end are given', async () => {
      expect(
        await service.getUniqueLifterCount(
          new PaginatedDTO({
            start: new Date('2022-01-05 20:35:00+00'),
            end: new Date('2022-01-06 20:35:00+00'),
          }),
        ),
      ).toEqual(1);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getRepeatLifterCount', () => {
    beforeAll(async () => {
      await createTwoBookingsAndAssignOneLifterToBoth();
    });

    it('should return the correct amount of repeat lifters when no params given', async () => {
      expect(await service.getRepeatLifterCount(new PaginatedDTO())).toEqual(1);
    });

    it('should return the correct amount when start is given', async () => {
      expect(
        await service.getRepeatLifterCount(
          new PaginatedDTO({
            start: new Date('2022-01-05 20:35:00+00'),
          }),
        ),
      ).toEqual(0);
    });

    it('should return the correct amount when start and end are given', async () => {
      expect(
        await service.getRepeatLifterCount(
          new PaginatedDTO({
            start: new Date('2022-01-05 20:35:00+00'),
            end: new Date('2022-01-06 20:35:00+00'),
          }),
        ),
      ).toEqual(0);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('count', () => {
    beforeAll(async () => {
      await setupMultiple();
    });

    it('should get the correct count when no params are passed', async () => {
      expect(await service.count(new PaginatedDTO())).toEqual(2);
    });

    it('should get correct count when start is given', async () => {
      const count = await service.count(
        new PaginatedDTO({
          start: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(count).toEqual(1);
    });

    it('should return correct count when start and end are given', async () => {
      const count = await service.count(
        new PaginatedDTO({
          start: new Date('2022-01-05 10:35:00+00'),
          end: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(count).toEqual(1);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('createBatch', () => {
    it('should successfully create an address, lifter, and lifter stats object', async () => {
      const address = new AddressDTO({
        street: 'test1',
        street2: 'test1',
        city: 'city',
        state: 'state',
        postalCode: 'postalCode',
      });

      const lifter = new LifterDTO({
        firstName: 'test',
        lastName: 'test',
        phone: '8015555557',
        passedBc: false,
        bcInProgress: false,
        email: 'test2@test.com',
        hasPickupTruck: true,
        status: 'contacted',
        userId: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
      });

      const batch = new LifterBatchDTO({
        lifter: lifter,
        address: address,
      });

      const createdLifter = await service.createBatch(batch);
      expect(createdLifter.id).not.toBeNull();

      const createdAddress = await addressRepo.findOne({
        id: createdLifter.addressId,
      });

      expect(createdAddress.id).not.toBeNull();

      const createdStats = await statsRepo.findOne({
        lifterId: createdLifter.id,
      });

      expect(createdStats).not.toBeUndefined();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('beginVerifyPhoneNumber', () => {
    it('should create a verification code of length 6 successfully', async () => {
      jest
        .spyOn(textClient, 'sendPhoneVerificationText')
        .mockImplementation(async () => {
          return;
        });
      await service.beginVerifyPhoneNumber(
        new PendingVerificationDTO({
          user: '8015555555',
        }),
      );

      const pending = await pendingRepo.find();
      expect(pending.length).toEqual(1);
      expect(pending[0].code).not.toBeNull();
      expect(pending[0].code.length).toBe(6);
    });

    it('should overwrite the code if a phone verification already exists', async () => {
      jest
        .spyOn(textClient, 'sendPhoneVerificationText')
        .mockImplementation(async () => {
          return;
        });

      await service.beginVerifyPhoneNumber(
        new PendingVerificationDTO({
          user: '8015555555',
        }),
      );

      const pending = (await pendingRepo.find())[0];
      expect(pending.code.length).toBe(6);

      await service.beginVerifyPhoneNumber(
        new PendingVerificationDTO({
          user: '8015555555',
        }),
      );

      const newPending = (await pendingRepo.find())[0];
      expect(newPending.user).toEqual(pending.user);
      expect(newPending.code).not.toEqual(pending.code);
    });

    afterAll(async () => {
      await cleanUpPending();
    });
  });

  describe('beginVerifyEmail', () => {
    it('should create a verification code of length 6 successfully', async () => {
      jest
        .spyOn(emailClient, 'sendEmailVerification')
        .mockImplementation(async () => {
          return;
        });
      await service.beginVerifyEmail(
        new PendingVerificationDTO({
          user: 'test@test.com',
        }),
      );

      const pending = await pendingRepo.find();
      expect(pending.length).toEqual(1);
      expect(pending[0].code).not.toBeNull();
      expect(pending[0].code.length).toBe(6);
    });

    it('should overwrite the code if a email verification already exists', async () => {
      jest
        .spyOn(emailClient, 'sendEmailVerification')
        .mockImplementation(async () => {
          return;
        });

      await service.beginVerifyEmail(
        new PendingVerificationDTO({
          user: 'test@test.com',
        }),
      );

      const pending = (await pendingRepo.find())[0];
      expect(pending.code.length).toBe(6);

      await service.beginVerifyEmail(
        new PendingVerificationDTO({
          user: 'test@test.com',
        }),
      );

      const newPending = (await pendingRepo.find())[0];
      expect(newPending.user).toEqual(pending.user);
      expect(newPending.code).not.toEqual(pending.code);
    });

    afterAll(async () => {
      await cleanUpPending();
    });
  });

  describe('verifyCode', () => {
    it('should throw a 409 error if the code is incorrect', async () => {
      expect(async () => {
        await service.verifyCode(new PendingVerificationDTO({ code: 'test' }));
      }).rejects.toEqual(new ConflictException('Code is incorrect'));
    });

    it('should delete the pending row if the code is correct', async () => {
      const pending = new PendingVerification({
        user: 'tester',
        code: 'test',
      });

      const created = await pendingRepo.save(pending);

      await service.verifyCode(
        new PendingVerificationDTO({
          user: 'tester',
          code: 'test',
        }),
      );

      const gotPending = await pendingRepo.findOne({ id: created.id });
      expect(gotPending).toBeUndefined();
    });

    afterAll(async () => {
      await cleanUpPending();
    });
  });

  describe('updateBatch', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      lifter = await setup();
    });

    it('should sucessfully update the lifter and address if both are given', async () => {
      const lifterDto = new LifterUpdateDTO({
        id: lifter.id,
        firstName: 'UPDATED',
      });

      const addressDto = new AddressUpdateDTO({
        id: lifter.addressId,
        state: 'UPDATED',
      });
      const updateDto = new LifterUpdateBatchDTO({
        address: addressDto,
        lifter: lifterDto,
      });

      const updated = await service.updateBatch(updateDto);
      expect(updated.firstName).toEqual('UPDATED');
      const updatedAddress = await addressRepo.findOne({ id: addressDto.id });
      expect(updatedAddress.state).toEqual('UPDATED');
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const setup = async () => {
    const createdLifter = await lifterRepo.save(
      new Lifter({
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
      }),
    );

    return createdLifter;
  };

  const setupMultiple = async () => {
    const createdLifters = [
      await lifterRepo.save(
        new Lifter({
          firstName: 'test',
          lastName: 'test',
          phone: '8015555555',
          passedBc: false,
          bcInProgress: false,
          email: 'test@test.com',
          hasPickupTruck: true,
          status: 'contacted',
          userId: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
          creationDate: new Date('2022-01-05 18:35:00+00'),
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
        }),
      ),
      await lifterRepo.save(
        new Lifter({
          firstName: 'test',
          lastName: 'test',
          phone: '8015555556',
          passedBc: true,
          bcInProgress: true,
          email: 'test2@test.com',
          hasPickupTruck: true,
          status: 'contacted',
          userId: '7628dfcb-b78c-4435-bf7c-33e7728f6a12',
          deletionPending: true,
          creationDate: new Date('2022-01-06 18:35:00+00'),
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
        }),
      ),
    ];

    return createdLifters;
  };

  const createTwoBookingsAndAssignOneLifterToEach = async () => {
    const booking = new Booking({
      needsPickupTruck: true,
      name: `test-booking`,
      phone: '8015555555',
      email: 'test@test.com',
      startingAddressId: (
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
      endingAddressId: (
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
      startTime: new Date('2022-01-06 18:35:00+00'),
      endTime: new Date('2022-01-06 20:35:00+00'),
      lifterCount: 2,
      hoursCount: 2,
      totalCost: 240,
      timezone: 'America/Denver',
      distanceInfo: 'none',
    });

    const booking2 = new Booking({
      needsPickupTruck: false,
      name: `test-booking2`,
      phone: '8015555555',
      email: 'test@test.com',
      startingAddressId: (
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
      endingAddressId: (
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
      startTime: new Date('2022-01-05 18:35:00+00'),
      endTime: new Date('2022-01-05 20:35:00+00'),
      lifterCount: 2,
      hoursCount: 2,
      totalCost: 240,
      timezone: 'America/Denver',
      distanceInfo: 'none',
    });

    await bookingRepo.save(booking);
    await bookingRepo.save(booking2);
    const liftOne = new Lift({
      bookingId: booking.id,
      completionToken: 'test12',
      currentLifterCount: 1,
      hasPickupTruck: true,
    });

    const liftTwo = new Lift({
      bookingId: booking2.id,
      completionToken: 'test12',
      hasPickupTruck: true,
    });

    const createdLifts = [
      await liftRepo.save(liftOne),
      await liftRepo.save(liftTwo),
    ];

    const lifters = [
      new Lifter({
        firstName: 'test',
        lastName: 'test',
        phone: '8015555555',
        passedBc: true,
        email: 'test@test.com',
        hasPickupTruck: true,
        status: 'contacted',
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
      }),
      new Lifter({
        firstName: 'test1',
        lastName: 'test1',
        phone: '8015555556',
        passedBc: true,
        email: 'test2@test.com',
        hasPickupTruck: true,
        status: 'contacted',
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
      }),
    ];

    const newLifters = [
      await lifterRepo.save(lifters[0]),
      await lifterRepo.save(lifters[1]),
    ];

    const createdAcceptedLifts: AcceptedLift[] = [];

    createdAcceptedLifts.push(
      await acceptedLiftRepo.save(
        new AcceptedLift({
          liftId: createdLifts[0].id,
          lifterId: newLifters[0].id,
          payrate: 20,
          usePickupTruck: true,
          totalPay: 40,
        }),
      ),
    );

    createdAcceptedLifts.push(
      await acceptedLiftRepo.save(
        new AcceptedLift({
          liftId: createdLifts[1].id,
          lifterId: newLifters[1].id,
          payrate: 20,
          usePickupTruck: true,
          totalPay: 40,
        }),
      ),
    );

    return {
      lifters: newLifters,
      acceptedLifts: createdAcceptedLifts,
      lifts: createdLifts,
    };
  };

  const createTwoBookingsAndAssignOneLifterToBoth = async () => {
    const booking = new Booking({
      needsPickupTruck: true,
      name: `test-booking`,
      phone: '8015555555',
      email: 'test@test.com',
      startingAddressId: (
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
      endingAddressId: (
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
      startTime: new Date('2022-01-06 18:35:00+00'),
      endTime: new Date('2022-01-06 20:35:00+00'),
      lifterCount: 2,
      hoursCount: 2,
      totalCost: 240,
      timezone: 'America/Denver',
      distanceInfo: 'none',
    });

    const booking2 = new Booking({
      needsPickupTruck: false,
      name: `test-booking2`,
      phone: '8015555555',
      email: 'test@test.com',
      startingAddressId: (
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
      endingAddressId: (
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
      startTime: new Date('2022-01-05 18:35:00+00'),
      endTime: new Date('2022-01-05 20:35:00+00'),
      lifterCount: 2,
      hoursCount: 2,
      totalCost: 240,
      timezone: 'America/Denver',
      distanceInfo: 'none',
    });

    await bookingRepo.save(booking);
    await bookingRepo.save(booking2);
    const liftOne = new Lift({
      bookingId: booking.id,
      completionToken: 'test12',
      currentLifterCount: 1,
      hasPickupTruck: true,
    });

    const liftTwo = new Lift({
      bookingId: booking2.id,
      completionToken: 'test12',
      hasPickupTruck: true,
    });

    const createdLifts = [
      await liftRepo.save(liftOne),
      await liftRepo.save(liftTwo),
    ];

    const lifters = [
      new Lifter({
        firstName: 'test',
        lastName: 'test',
        phone: '8015555555',
        passedBc: true,
        email: 'test@test.com',
        hasPickupTruck: true,
        status: 'contacted',
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
      }),
    ];

    const newLifters = [await lifterRepo.save(lifters[0])];

    const createdAcceptedLifts: AcceptedLift[] = [];

    createdAcceptedLifts.push(
      await acceptedLiftRepo.save(
        new AcceptedLift({
          liftId: createdLifts[0].id,
          lifterId: newLifters[0].id,
          payrate: 20,
          usePickupTruck: true,
          totalPay: 40,
        }),
      ),
    );

    createdAcceptedLifts.push(
      await acceptedLiftRepo.save(
        new AcceptedLift({
          liftId: createdLifts[1].id,
          lifterId: newLifters[0].id,
          payrate: 20,
          usePickupTruck: true,
          totalPay: 40,
        }),
      ),
    );

    return {
      lifters: newLifters,
      acceptedLifts: createdAcceptedLifts,
      lifts: createdLifts,
    };
  };

  const cleanUp = async () => {
    const stats = await statsRepo.find();

    for (const stat of stats) {
      await statsRepo.delete({ id: stat.id });
    }

    const acceptedLifts = await acceptedLiftRepo.find();

    for (const lift of acceptedLifts) {
      await acceptedLiftRepo.delete({ id: lift.id });
    }

    const lifts = await liftRepo.find();

    for (const lift of lifts) {
      await liftRepo.delete({ id: lift.id });
    }

    const bookings = await bookingRepo.find();

    for (const booking of bookings) {
      await bookingRepo.delete({ id: booking.id });
    }

    const lifters = await lifterRepo.find();
    for (const lifter of lifters) {
      await lifterRepo.delete({ id: lifter.id });
    }

    const addresses = await addressRepo.find();
    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }
  };

  const cleanUpPending = async () => {
    const pendings = await pendingRepo.find();
    for (const pending of pendings) {
      await pendingRepo.delete({ id: pending.id });
    }
  };
});
