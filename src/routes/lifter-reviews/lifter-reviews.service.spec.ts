import { Test, TestingModule } from '@nestjs/testing';
import { LifterReviewsService } from './lifter-reviews.service';

describe('LifterReviewsService', () => {
  let service: LifterReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifterReviewsService],
    }).compile();

    service = module.get<LifterReviewsService>(LifterReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
