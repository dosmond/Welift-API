import { Test, TestingModule } from '@nestjs/testing';
import { LifterReviewsController } from './lifter-reviews.controller';

describe('LifterReviewsController', () => {
  let controller: LifterReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifterReviewsController],
    }).compile();

    controller = module.get<LifterReviewsController>(LifterReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
