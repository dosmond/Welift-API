import { AuthModule } from './../../auth/auth.module';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { BadgeDTO } from '@src/dto/badge.dto';
import { Badge } from '@src/model/badges.entity';
import { Repository } from 'typeorm';
import { BadgeService } from './badge.service';

describe('BadgeService', () => {
  let service: BadgeService;
  let badgeRepo: Repository<Badge>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Badge]),
        AuthModule,
      ],
      providers: [BadgeService],
    }).compile();

    service = module.get<BadgeService>(BadgeService);
    badgeRepo = module.get(getRepositoryToken(Badge));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await createTwoBadges();
    });

    it('should return all badges', async () => {
      expect((await service.getAll()).length).toEqual(2);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getById', () => {
    let badges: Badge[];
    beforeAll(async () => {
      badges = await createTwoBadges();
    });

    it('should return the expected Badge', async () => {
      expect((await service.getById(badges[0].id)).id).toEqual(badges[0].id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('create', () => {
    it('should create a badge', async () => {
      await service.create(
        new BadgeDTO({
          name: 'TestTest',
          requiredValue: 100,
        }),
      );

      expect((await badgeRepo.find())[0].name).toEqual('TestTest');
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('update', () => {
    let badges: Badge[];
    beforeAll(async () => {
      badges = await createTwoBadges();
    });

    it('should update the Badge', async () => {
      const badgeDTO = BadgeDTO.fromEntity(badges[0]);
      badgeDTO.requiredValue = 200;
      expect((await service.update(badgeDTO)).requiredValue).toEqual(200);
    });

    it('should throw a 400 error if the Badge does not exist', async () => {
      expect(
        async () =>
          await service.update(
            new BadgeDTO({
              id: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
              requiredValue: 200,
            }),
          ),
      ).rejects.toEqual(new BadRequestException('Badge does not exist'));
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const createTwoBadges = async () => {
    return [
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
  };

  const cleanUp = async () => {
    const badges = await badgeRepo.find();
    for (const badge of badges) {
      await badgeRepo.delete({ id: badge.id });
    }
  };
});
