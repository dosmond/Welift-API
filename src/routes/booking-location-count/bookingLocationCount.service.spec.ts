import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PushNotificationHelper } from '@src/helper/pushNotification.helper';
import { BookingLocationCount } from '@src/model/bookingLocationCount.entity';
import { Repository } from 'typeorm';
import { BookingLocationCountService } from './bookingLocationCount.service';

describe('BookingService', () => {
  let service: BookingLocationCountService;
  let bookingCountRepo: Repository<BookingLocationCount>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([BookingLocationCount]),
      ],
      providers: [BookingLocationCountService, PushNotificationHelper],
    }).compile();

    service = module.get<BookingLocationCountService>(
      BookingLocationCountService,
    );
    bookingCountRepo = module.get(getRepositoryToken(BookingLocationCount));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getByState', () => {
    let counts: BookingLocationCount[];

    beforeAll(async () => {
      counts = await setup();
    });

    it('should get the row by state', async () => {
      const count = await service.getByState(counts[0].state);

      expect(count.id).toEqual(counts[0].id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAll', () => {
    let counts: BookingLocationCount[];

    beforeAll(async () => {
      counts = await setup();
    });

    it('should get all rows', async () => {
      const gotCounts = await service.getAll();

      expect(gotCounts.length).toEqual(counts.length);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('upsert', () => {
    let counts: BookingLocationCount[];

    beforeAll(async () => {
      counts = await setup();
    });

    it('should be able to create a BookingLocationCount if no id is passed in', async () => {
      const newCount = await service.upsert(
        new BookingLocationCount({
          state: 'AZ',
          count: 1,
        }),
      );

      expect(newCount.id).not.toBeNull();
    });

    it('should be able to update a BookingLocationCount if id is passed in', async () => {
      await service.upsert(
        new BookingLocationCount({
          id: counts[0].id,
          count: 2,
        }),
      );

      const updateCount = await bookingCountRepo.findOne({ id: counts[0].id });

      expect(updateCount.count).toEqual(2);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const setup = async () => {
    const countOne = new BookingLocationCount({
      state: 'UT',
      count: 1,
    });

    const countTwo = new BookingLocationCount({
      state: 'NV',
      count: 1,
    });

    return [
      await bookingCountRepo.save(countOne),
      await bookingCountRepo.save(countTwo),
    ];
  };

  const cleanUp = async () => {
    const counts = await bookingCountRepo.find();

    for (const count of counts) {
      await bookingCountRepo.delete({ id: count.id });
    }
  };
});
