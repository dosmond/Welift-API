import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { LifterTransaction } from './../../model/lifterTransaction.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { Order } from '@src/enum/order.enum';
import { TextClient } from '@src/helper/text.client';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Address } from '@src/model/addresses.entity';
import { Booking } from '@src/model/booking.entity';
import { Lifter } from '@src/model/lifters.entity';
import { Lift } from '@src/model/lifts.entity';
import { Repository } from 'typeorm';
import { AcceptedLiftService } from '../accepted-lift/accepted-lift.service';
import { LiftsService } from './lifts.service';

describe('LiftsService', () => {
  let service: LiftsService;
  let liftRepo: Repository<Lift>;
  let bookingRepo: Repository<Booking>;
  let addressRepo: Repository<Address>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([
          Lift,
          LifterTransaction,
          AcceptedLift,
          Lifter,
          Booking,
          Address,
        ]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      providers: [
        LiftsService,
        AcceptedLiftService,
        TextClient,
        LifterTransactionsService,
        EventEmitter2,
      ],
    }).compile();

    service = module.get<LiftsService>(LiftsService);
    liftRepo = module.get(getRepositoryToken(Lift));
    bookingRepo = module.get(getRepositoryToken(Booking));
    addressRepo = module.get(getRepositoryToken(Address));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    let lift: Lift;

    beforeAll(async () => {
      const created = await setupSingleLift();
      lift = created.createdLift;
    });

    it('should get the correct lift', async () => {
      const gotLift = await service.getById(lift.id);
      expect(gotLift).not.toBeFalsy();
      expect(gotLift.id).toEqual(lift.id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await setupMultipleLifts();
    });

    it('should get all lifts if no params are given', async () => {
      const gotLifts = await service.getAll(new PaginatedDTO());
      expect(gotLifts.length).toEqual(2);
    });

    it('should return correct lifts when start is given', async () => {
      const gotLifts = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(gotLifts.length).toEqual(1);
    });

    it('should return correct lifts when start and end are given', async () => {
      const gotLifts = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 10:35:00+00'),
          end: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(gotLifts.length).toEqual(1);
    });

    it('should return in the correct order: default (DESC)', async () => {
      const gotLifts = await service.getAll(new PaginatedDTO());
      expect(
        new Date(gotLifts[0].booking.startTime) >
          new Date(gotLifts[1].booking.startTime),
      ).toBeTruthy();
    });

    it('should return in the correct order: (ASC)', async () => {
      const gotLifts = await service.getAll(
        new PaginatedDTO({
          order: Order.ASC,
        }),
      );
      expect(
        new Date(gotLifts[0].booking.startTime) <
          new Date(gotLifts[1].booking.startTime),
      ).toBeTruthy();
    });

    it('should return correct pages', async () => {
      const gotLiftsOne = await service.getAll(
        new PaginatedDTO({
          page: 1,
          pageSize: 1,
        }),
      );

      expect(gotLiftsOne.length).toEqual(1);
      const gotLiftsTwo = await service.getAll(
        new PaginatedDTO({
          page: 2,
          pageSize: 1,
        }),
      );
      expect(gotLiftsTwo.length).toEqual(1);
      expect(gotLiftsTwo[0].id).not.toEqual(gotLiftsOne[0].id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('count', () => {
    beforeAll(async () => {
      await setupMultipleLifts();
    });

    it('should get all count of all lifts if no params are given', async () => {
      const count = await service.count(new PaginatedDTO());
      expect(count).toEqual(2);
    });

    it('should return correct count when start is given', async () => {
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

  const setupSingleLift = async () => {
    const booking = new Booking({
      needsPickupTruck: false,
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
      lifterCount: 1,
      hoursCount: 2,
      totalCost: 240,
      timezone: 'America/Denver',
      distanceInfo: 'none',
    });

    const createdBooking = await bookingRepo.save(booking);
    const createdLift = await liftRepo.save(
      new Lift({
        bookingId: createdBooking.id,
        completionToken: 'test12',
      }),
    );

    return { createdLift, createdBooking };
  };

  const setupMultipleLifts = async () => {
    const createdBookings = [
      await bookingRepo.save(
        new Booking({
          needsPickupTruck: false,
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
          lifterCount: 1,
          hoursCount: 2,
          totalCost: 240,
          timezone: 'America/Denver',
          distanceInfo: 'none',
        }),
      ),
      await bookingRepo.save(
        new Booking({
          needsPickupTruck: true,
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
          lifterCount: 1,
          hoursCount: 2,
          totalCost: 240,
          timezone: 'America/Denver',
          distanceInfo: 'none',
        }),
      ),
    ];

    const liftOne = new Lift({
      bookingId: createdBookings[0].id,
      completionToken: 'test12',
    });

    const liftTwo = new Lift({
      bookingId: createdBookings[1].id,
      completionToken: 'test12',
    });

    const createdLifts = [
      await liftRepo.save(liftOne),
      await liftRepo.save(liftTwo),
    ];

    return { createdLifts, createdBookings };
  };

  const cleanUp = async () => {
    const lifts = await liftRepo.find();
    for (const lift of lifts) {
      await liftRepo.delete({ id: lift.id });
    }

    const bookings = await bookingRepo.find();
    for (const booking of bookings) {
      await bookingRepo.delete({ id: booking.id });
    }

    const addresses = await addressRepo.find();
    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }
  };
});
