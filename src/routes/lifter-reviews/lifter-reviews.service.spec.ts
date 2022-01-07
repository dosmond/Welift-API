import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterReview } from '@src/model/lifterReviews.entity';
import { LifterReviewsService } from './lifter-reviews.service';

describe('LifterReviewsService', () => {
  let service: LifterReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterReview]),
      ],
      providers: [LifterReviewsService],
    }).compile();

    service = module.get<LifterReviewsService>(LifterReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
