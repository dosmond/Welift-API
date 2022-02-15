import { AuthModule } from './../../auth/auth.module';
import { Lifter } from './../../model/lifters.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Address } from '@src/model/addresses.entity';
import { LifterStats } from '@src/model/lifterStats.entity';
import { LifterStatsService } from './lifter-stats.service';
import { Repository } from 'typeorm';

describe('LifterStatsService', () => {
  let service: LifterStatsService;
  let lifterRepo: Repository<Lifter>;
  let addressRepo: Repository<Address>;
  let statsRepo: Repository<LifterStats>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterStats, Address, Lifter]),
        AuthModule,
      ],
      providers: [LifterStatsService],
    }).compile();

    service = module.get<LifterStatsService>(LifterStatsService);
    lifterRepo = module.get(getRepositoryToken(Lifter));
    addressRepo = module.get(getRepositoryToken(Address));
    statsRepo = module.get(getRepositoryToken(LifterStats));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLifterStats', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      const { createdLifter } = await setup();
      lifter = createdLifter;
    });

    it('should get the stats for the correct lifter', async () => {
      expect((await service.getLifterStats(lifter.id)).lifterId).toEqual(
        lifter.id,
      );
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('delete', () => {
    let stats: LifterStats;

    beforeAll(async () => {
      const { createdStats } = await setup();
      stats = createdStats;
    });

    it('should successfuly delete the lifter stats row', async () => {
      await service.delete(stats.id);
      const deletedReview = await statsRepo.findOne({ id: stats.id });
      expect(deletedReview).toBeUndefined();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('deleteByLifterId', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      const { createdLifter } = await setup();
      lifter = createdLifter;
    });

    it('should successfuly delete the lifter stats row', async () => {
      await service.deleteByLifterId(lifter.id);
      const deletedReviews = await statsRepo.find();
      expect(deletedReviews.length).toEqual(0);
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

    const createdStats = await statsRepo.save(
      new LifterStats({
        lifterId: createdLifter.id,
      }),
    );

    return { createdStats, createdLifter };
  };

  const cleanUp = async () => {
    const stats = await statsRepo.find();
    for (const stat of stats) {
      await statsRepo.delete({ id: stat.id });
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
});
