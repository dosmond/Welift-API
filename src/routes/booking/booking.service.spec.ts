import { AuthModule } from './../../auth/auth.module';
import { BookingUpdateDTO } from './../../dto/booking.update.dto';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CronHelper } from './../../helper/cron.helper';
import { EmailClient } from '@src/helper/email.client';
import { configService } from '@src/config/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { GoogleCalendarApiHelper } from '@src/helper/googleCalendar.helper';
import { PushNotificationHelper } from '@src/helper/pushNotification.helper';
import { SlackHelper } from '@src/helper/slack.helper';
import { TextClient } from '@src/helper/text.client';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Booking } from '@src/model/booking.entity';
import { BookingLocationCount } from '@src/model/bookingLocationCount.entity';
import { Lift } from '@src/model/lifts.entity';
import { Note } from '@src/model/note.entity';
import { Partner } from '@src/model/partner.entity';
import { PartnerReferral } from '@src/model/partnerReferrals.entity';
import { BookingLocationCountService } from '../booking-location-count/bookingLocationCount.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CronJobDescription } from '@src/model/cronjob.entity';
import { Repository } from 'typeorm';
import { Address } from '@src/model/addresses.entity';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { Order } from '@src/enum/order.enum';
import { BookingBatchDTO } from '@src/dto/booking.batch.dto';
import { AddressDTO } from '@src/dto/address.dto';
import { BookingDTO } from '@src/dto/booking.dto';
import { BadRequestException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepo: Repository<Booking>;
  let liftRepo: Repository<Lift>;
  let addressRepo: Repository<Address>;
  let bookingCountRepo: Repository<BookingLocationCount>;
  let notesRepo: Repository<Note>;
  let module: TestingModule;
  let cronHelper: CronHelper;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
          Address,
          Booking,
          BookingLocationCount,
          CronJobDescription,
          AcceptedLift,
          PartnerReferral,
          Partner,
          Lift,
          Note,
        ]),
        AuthModule,
      ],
      controllers: [BookingController],
      providers: [
        BookingService,
        TextClient,
        GoogleCalendarApiHelper,
        SlackHelper,
        BookingLocationCountService,
        PushNotificationHelper,
        EmailClient,
        CronHelper,
        EventEmitter2,
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepo = module.get(getRepositoryToken(Booking));
    liftRepo = module.get(getRepositoryToken(Lift));
    addressRepo = module.get(getRepositoryToken(Address));
    notesRepo = module.get(getRepositoryToken(Note));
    bookingCountRepo = module.get(getRepositoryToken(BookingLocationCount));
    cronHelper = module.get<CronHelper>(CronHelper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    let bookings: Booking[];

    beforeAll(async () => {
      bookings = await createTwoBookings();
    });

    it('should get the correct booking', async () => {
      expect((await service.getById(bookings[0].id)).id).toEqual(
        bookings[0].id,
      );
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAll', () => {
    let bookings: Booking[];

    beforeAll(async () => {
      bookings = await createTwoBookings();
    });

    it('should get all bookings when no params given', async () => {
      expect((await service.getAll(new PaginatedDTO())).length).toEqual(
        bookings.length,
      );
    });

    it('should get correct Booking when start is given', async () => {
      const bookings = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(bookings.length).toEqual(1);
    });

    it('should return correct bookings when start and end are given', async () => {
      const bookings = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 10:35:00+00'),
          end: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(bookings.length).toEqual(1);
    });

    it('should return in the correct order: default (DESC)', async () => {
      const bookings = await service.getAll(new PaginatedDTO());
      expect(
        new Date(bookings[0].startTime) > new Date(bookings[1].startTime),
      ).toBeTruthy();
    });

    it('should return in the correct order: (ASC)', async () => {
      const bookings = await service.getAll(
        new PaginatedDTO({
          order: Order.ASC,
        }),
      );
      expect(
        new Date(bookings[0].startTime) < new Date(bookings[1].startTime),
      ).toBeTruthy();
    });

    it('should return correct pages', async () => {
      const bookingsPageOne = await service.getAll(
        new PaginatedDTO({
          page: 1,
          pageSize: 1,
        }),
      );

      expect(bookingsPageOne.length).toEqual(1);
      const bookingsPageTwo = await service.getAll(
        new PaginatedDTO({
          page: 2,
          pageSize: 1,
        }),
      );
      expect(bookingsPageTwo.length).toEqual(1);
      expect(bookingsPageTwo[0].id).not.toEqual(bookingsPageOne[0].id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getTotalEarnings', () => {
    beforeAll(async () => {
      await createTwoBookings();
    });

    it('should get total earnings of all bookings when no params are given', async () => {
      expect((await service.getTotalEarnings(null, null)).sum).toEqual(480);
    });

    it('should get correct sum when start is given', async () => {
      const total = await service.getTotalEarnings(
        new Date('2022-01-05 22:35:00+00'),
        null,
      );
      expect(total.sum).toEqual(240);
    });

    it('should return correct sum when start and end are given', async () => {
      const total = await service.getTotalEarnings(
        new Date('2022-01-05 10:35:00+00'),
        new Date('2022-01-05 22:35:00+00'),
      );
      expect(total.sum).toEqual(240);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('count', () => {
    beforeAll(async () => {
      await createTwoBookings();
    });

    it('should get the correct count', async () => {
      expect(await service.count()).toEqual(2);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('createBatch', () => {
    beforeAll(async () => {
      await createTwoBookings();
    });

    it('should create a booking, addresses, and a lift', async () => {
      jest.spyOn(cronHelper, 'addCronJob').mockImplementation(async () => {
        return;
      });

      const batch = new BookingBatchDTO({
        startingAddress: new AddressDTO({
          street: 'test1',
          street2: 'test1',
          city: 'city',
          state: 'state',
          postalCode: 'postalCode',
        }),
        endingAddress: new AddressDTO({
          street: 'test1',
          street2: 'test1',
          city: 'city',
          state: 'state',
          postalCode: 'postalCode',
        }),
        booking: new BookingDTO({
          needsPickupTruck: true,
          name: `test-booking`,
          phone: '8015555555',
          email: 'test@test.com',
          startTime: new Date('2022-01-06 18:35:00+00'),
          endTime: new Date('2022-01-06 20:35:00+00'),
          lifterCount: 2,
          hoursCount: 2,
          totalCost: 240,
          timezone: 'America/Denver',
          distanceInfo: 'none',
          creationDate: new Date('2022-01-06 18:35:00+00'),
        }),
      });

      let booking = await service.createBatch(batch);

      expect(cronHelper.addCronJob).toHaveBeenCalled();
      expect(booking.id).not.toBeNull();

      booking = await service.getById(booking.id);
      expect(booking.lift.id).not.toBeNull();
      expect(booking.startingAddressId).not.toBeNull();
      expect(booking.endingAddressId).not.toBeNull();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('update', () => {
    let bookings: Booking[];

    beforeAll(async () => {
      bookings = await createTwoBookings();
    });

    it('should update the booking', async () => {
      const updateBooking = BookingUpdateDTO.fromEntity(
        await bookingRepo.findOne(
          { id: bookings[0].id },
          { relations: ['lift', 'startingAddress', 'endingAddress'] },
        ),
      );
      updateBooking.name = 'Updated Name';
      await service.update(updateBooking);

      const booking = await bookingRepo.findOne({ id: bookings[0].id });
      expect(booking.name).toEqual(updateBooking.name);
    });

    it('should throw a 400 error if the booking does not exist', async () => {
      expect(async () => {
        await service.update(
          new BookingUpdateDTO({
            id: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
          }),
        );
      }).rejects.toEqual(new BadRequestException('Booking does not exist'));
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('delete', () => {
    let bookings: Booking[];

    beforeAll(async () => {
      bookings = await createTwoBookings();
    });

    it('should delete the booking, lift, and notes', async () => {
      await service.delete(bookings[0].id, '', '');
      const booking = await bookingRepo.findOne({ id: bookings[0].id });
      const notes = await notesRepo.find();

      expect(booking).toBeUndefined();
      expect(notes.length).toEqual(0);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const createTwoBookings = async () => {
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
      creationDate: new Date('2022-01-06 18:35:00+00'),
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
      creationDate: new Date('2022-01-05 18:35:00+00'),
    });

    const bookings = [
      await bookingRepo.save(booking),
      await bookingRepo.save(booking2),
    ];

    await notesRepo.save(
      new Note({
        bookingId: bookings[0].id,
        note: 'Test',
        author: 'test@test.com',
      }),
    );

    return bookings;
  };

  const cleanUp = async () => {
    const lifts = await liftRepo.find();

    for (const lift of lifts) {
      await liftRepo.delete({ id: lift.id });
    }

    const notes = await notesRepo.find();

    for (const note of notes) {
      await notesRepo.delete({ id: note.id });
    }

    const bookings = await bookingRepo.find();

    for (const booking of bookings) {
      await bookingRepo.delete({ id: booking.id });
    }

    const addresses = await addressRepo.find();

    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }

    const bookingCount = await bookingCountRepo.find();

    for (const count of bookingCount) {
      await bookingCountRepo.delete({ id: count.id });
    }
  };

  afterAll(async () => {
    module.close();
  });
});
