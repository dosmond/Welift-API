import { LifterStats } from '@src/model/lifterStats.entity';
import { Lifter } from '@src/model/lifters.entity';
import { Booking } from '@src/model/booking.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lift } from '@src/model/lifts.entity';
import { AcceptedLiftService } from './accepted-lift.service';
import { DeleteResult, Repository } from 'typeorm';
import { Address } from '@src/model/addresses.entity';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { Order } from '@src/enum/order.enum';

describe('AcceptedLiftService', () => {
  let service: AcceptedLiftService;
  let bookingRepo: Repository<Booking>;
  let acceptedLiftRepo: Repository<AcceptedLift>;
  let liftRepo: Repository<Lift>;
  let lifterRepo: Repository<Lifter>;
  let addressRepo: Repository<Address>;
  let lifterStatsRepo: Repository<LifterStats>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([
          AcceptedLift,
          Lift,
          Booking,
          Lifter,
          Address,
          LifterStats,
        ]),
      ],
      providers: [AcceptedLiftService],
    }).compile();

    service = module.get<AcceptedLiftService>(AcceptedLiftService);
    addressRepo = module.get(getRepositoryToken(Address));
    lifterRepo = module.get(getRepositoryToken(Lifter));
    lifterStatsRepo = module.get(getRepositoryToken(LifterStats));
    liftRepo = module.get(getRepositoryToken(Lift));
    acceptedLiftRepo = module.get(getRepositoryToken(AcceptedLift));
    bookingRepo = module.get(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await createTwoBookingsAndAssignOneLifterToBoth();
    });

    it('should get all accepted lifts when no query params are passed', async () => {
      const acceptedLifts = await service.getAll(new PaginatedDTO());
      expect(acceptedLifts.length).toEqual(2);
    });

    it('should return correct accepted lifts when start is given', async () => {
      const acceptedLifts = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(acceptedLifts.length).toEqual(1);
    });

    it('should return correct accepted lifts when start and end are given', async () => {
      const acceptedLifts = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 10:35:00+00'),
          end: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(acceptedLifts.length).toEqual(1);
    });

    it('should return in the correct order: default (DESC)', async () => {
      const acceptedLifts = await service.getAll(new PaginatedDTO());
      expect(
        new Date(acceptedLifts[0].lift.booking.startTime) >
          new Date(acceptedLifts[1].lift.booking.startTime),
      ).toBeTruthy();
    });

    it('should return in the correct order: (ASC)', async () => {
      const acceptedLifts = await service.getAll(
        new PaginatedDTO({
          order: Order.ASC,
        }),
      );
      expect(
        new Date(acceptedLifts[0].lift.booking.startTime) <
          new Date(acceptedLifts[1].lift.booking.startTime),
      ).toBeTruthy();
    });

    it('should return correct pages', async () => {
      const acceptedLiftsPageOne = await service.getAll(
        new PaginatedDTO({
          page: 1,
          pageSize: 1,
        }),
      );

      expect(acceptedLiftsPageOne.length).toEqual(1);
      const acceptedLiftsPageTwo = await service.getAll(
        new PaginatedDTO({
          page: 2,
          pageSize: 1,
        }),
      );
      expect(acceptedLiftsPageTwo.length).toEqual(1);
      expect(acceptedLiftsPageTwo[0].id).not.toEqual(
        acceptedLiftsPageOne[0].id,
      );
    });

    afterAll(async () => {
      await cleanup();
    });
  });

  const createTwoBookingsAndAssignOneLifterToBoth = async () => {
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
    });

    const liftTwo = new Lift({
      bookingId: booking2.id,
      completionToken: 'test12',
    });

    const createdLifts = [
      await liftRepo.save(liftOne),
      await liftRepo.save(liftTwo),
    ];

    const lifter = new Lifter({
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
    });
    const newLifter = await lifterRepo.save(lifter);

    for (const lift of createdLifts) {
      await acceptedLiftRepo.save(
        new AcceptedLift({
          liftId: lift.id,
          lifterId: newLifter.id,
          payrate: 20,
          usePickupTruck: true,
        }),
      );
    }
  };

  const cleanup = async () => {
    const bookings = await bookingRepo.find();
    const lifts = await liftRepo.find();
    const lifters = await lifterRepo.find();
    const acceptedLifts = await acceptedLiftRepo.find();
    const addresses = await addressRepo.find();
    const lifterStats = await lifterStatsRepo.find();

    let promises: Promise<DeleteResult>[] = [];
    acceptedLifts.forEach((lift) => {
      promises.push(acceptedLiftRepo.delete({ id: lift.id }));
    });
    await Promise.all(promises);
    promises = [];

    lifts.forEach((lift) => {
      promises.push(liftRepo.delete({ id: lift.id }));
    });
    await Promise.all(promises);
    promises = [];

    lifterStats.forEach((lifter) => {
      promises.push(lifterStatsRepo.delete({ id: lifter.id }));
    });
    await Promise.all(promises);
    promises = [];

    lifters.forEach((lifter) => {
      promises.push(lifterRepo.delete({ id: lifter.id }));
    });
    await Promise.all(promises);
    promises = [];

    bookings.forEach((booking) => {
      promises.push(bookingRepo.delete({ id: booking.id }));
    });
    await Promise.all(promises);
    promises = [];

    addresses.forEach((address) => {
      promises.push(addressRepo.delete({ id: address.id }));
    });
    await Promise.all(promises);
  };
});
