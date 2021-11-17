import { Test, TestingModule } from '@nestjs/testing';
import { LifterCompletedTrainingVideosController } from './lifter-completed-training-videos.controller';

describe('LifterCompletedTrainingVideosController', () => {
  let controller: LifterCompletedTrainingVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifterCompletedTrainingVideosController],
    }).compile();

    controller = module.get<LifterCompletedTrainingVideosController>(
      LifterCompletedTrainingVideosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
