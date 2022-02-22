import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { CompletedLifterBadgeDTO } from '@src/dto/completeLifterBadge.dto';
import { Address } from '@src/model/addresses.entity';
import { Badge } from '@src/model/badges.entity';
import { CompletedLifterBadge } from '@src/model/completedLifterBadges.entity';
import { Lifter } from '@src/model/lifters.entity';
import { Repository } from 'typeorm';
import { CompletedLifterBadgeService } from './completed-lifter-badge.service';

describe('CompletedLifterBadgeService', () => {
  let service: CompletedLifterBadgeService;
  let badgeRepo: Repository<Badge>;
  let lifterRepo: Repository<Lifter>;
  let completedBadgeRepo: Repository<CompletedLifterBadge>;
  let addressRepo: Repository<Address>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([
          CompletedLifterBadge,
          Lifter,
          Badge,
          Address,
        ]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      providers: [CompletedLifterBadgeService],
    }).compile();

    service = module.get<CompletedLifterBadgeService>(
      CompletedLifterBadgeService,
    );
    badgeRepo = module.get(getRepositoryToken(Badge));
    lifterRepo = module.get(getRepositoryToken(Lifter));
    completedBadgeRepo = module.get(getRepositoryToken(CompletedLifterBadge));
    addressRepo = module.get(getRepositoryToken(Address));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    let completedBadge: CompletedLifterBadge;
    beforeAll(async () => {
      const { completedBadge: completed } =
        await createTwoBadgesALifterAndACompletedLifterBadge();
      completedBadge = completed;
    });

    it('should return the expected Completed Badge', async () => {
      expect((await service.getById(completedBadge.id)).id).toEqual(
        completedBadge.id,
      );
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('create', () => {
    let lifter: Lifter;
    let badges: Badge[];

    beforeAll(async () => {
      const { lifter: createdLifter, badges: createdBadges } =
        await createTwoBadgesALifterAndACompletedLifterBadge();

      lifter = createdLifter;
      badges = createdBadges;
    });

    it('should create a completed lifter badge', async () => {
      const created = await service.create(
        null,
        new CompletedLifterBadgeDTO({
          lifterId: lifter.id,
          badgeId: badges[1].id,
        }),
      );
      expect(
        (await completedBadgeRepo.findOne({ badgeId: badges[1].id })).id,
      ).toEqual(created.id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('delete', () => {
    let completedBadge: CompletedLifterBadge;
    beforeAll(async () => {
      const { completedBadge: createdCompleted } =
        await createTwoBadgesALifterAndACompletedLifterBadge();
      completedBadge = createdCompleted;
    });

    it('should delete the completed badge', async () => {
      await service.delete(null, completedBadge.id);

      expect(
        await completedBadgeRepo.findOne({ id: completedBadge.id }),
      ).toBeUndefined();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('deleteByLifterId', () => {
    let completedBadge: CompletedLifterBadge;
    let lifter: Lifter;
    beforeAll(async () => {
      const { completedBadge: createdCompleted, lifter: createdLifter } =
        await createTwoBadgesALifterAndACompletedLifterBadge();
      completedBadge = createdCompleted;
      lifter = createdLifter;
    });

    it('should delete all completed badges associated with a lifter', async () => {
      await service.deleteByLifterId(lifter.id);

      expect(
        await completedBadgeRepo.findOne({ id: completedBadge.id }),
      ).toBeUndefined();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const createTwoBadgesALifterAndACompletedLifterBadge = async () => {
    const badges = [
      await badgeRepo.save(
        new Badge({
          name: 'Test1',
          requiredValue: 100,
        }),
      ),
      await badgeRepo.save(
        new Badge({
          name: 'Test2',
          requiredValue: 100,
        }),
      ),
    ];

    const lifter = await lifterRepo.save(
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

    const completedBadge = await completedBadgeRepo.save(
      new CompletedLifterBadge({
        lifterId: lifter.id,
        badgeId: badges[0].id,
      }),
    );

    return { badges, lifter, completedBadge };
  };

  const cleanUp = async () => {
    const completedBadges = await completedBadgeRepo.find();

    for (const completed of completedBadges) {
      await completedBadgeRepo.delete({ id: completed.id });
    }

    const badges = await badgeRepo.find();
    for (const badge of badges) {
      await badgeRepo.delete({ id: badge.id });
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
