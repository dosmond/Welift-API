import { Test, TestingModule } from '@nestjs/testing';
import { TrainingVideosController } from './training-videos.controller';

describe('TrainingVideosController', () => {
  let controller: TrainingVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingVideosController],
    }).compile();

    controller = module.get<TrainingVideosController>(TrainingVideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
