import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterReviewDTO } from '@src/dto/lifterReview.dto';
import { Address } from '@src/model/addresses.entity';
import { LifterReview } from '@src/model/lifterReviews.entity';
import { Lifter } from '@src/model/lifters.entity';
import { Repository } from 'typeorm';
import { LifterReviewsService } from './lifter-reviews.service';

describe('LifterReviewsService', () => {
  let service: LifterReviewsService;
  let lifterRepo: Repository<Lifter>;
  let addressRepo: Repository<Address>;
  let reviewRepo: Repository<LifterReview>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterReview, Lifter, Address]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      providers: [LifterReviewsService],
    }).compile();

    service = module.get<LifterReviewsService>(LifterReviewsService);
    lifterRepo = module.get(getRepositoryToken(Lifter));
    addressRepo = module.get(getRepositoryToken(Address));
    reviewRepo = module.get(getRepositoryToken(LifterReview));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLifterReviews', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      const { createdLifter } = await setup();
      lifter = createdLifter;
    });

    it('should get all reviews associated with a lifter', async () => {
      expect((await service.getLifterReviews(lifter.id)).length).toEqual(2);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('create', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      const { createdLifter } = await setup();
      lifter = createdLifter;
    });

    it('should successfuly create a lifter review', async () => {
      const review = await service.create(
        new LifterReviewDTO({
          lifterId: lifter.id,
          content: 'meh',
          rating: 2,
        }),
      );

      expect(review.id).not.toBeNull();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('delete', () => {
    let reviews: LifterReview[];

    beforeAll(async () => {
      const { createdReviews } = await setup();
      reviews = createdReviews;
    });

    it('should successfuly delete a lifter review', async () => {
      await service.delete(reviews[0].id);
      const deletedReview = await reviewRepo.findOne({ id: reviews[0].id });
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

    it('should successfuly delete all reviews of a lifter', async () => {
      await service.deleteByLifterId(lifter.id);
      const deletedReviews = await reviewRepo.find();
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

    const createdReviews = [
      await reviewRepo.save(
        new LifterReview({
          lifterId: createdLifter.id,
          content: 'good',
          rating: 5,
        }),
      ),
      await reviewRepo.save(
        new LifterReview({
          lifterId: createdLifter.id,
          content: 'ok',
          rating: 4,
        }),
      ),
    ];

    return { createdReviews, createdLifter };
  };

  const cleanUp = async () => {
    const reviews = await reviewRepo.find();
    for (const review of reviews) {
      await reviewRepo.delete({ id: review.id });
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
