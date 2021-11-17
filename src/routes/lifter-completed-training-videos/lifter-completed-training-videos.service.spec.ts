import { Test, TestingModule } from '@nestjs/testing';
import { LifterCompletedTrainingVideosService } from './lifter-completed-training-videos.service';

describe('LifterCompletedTrainingVideosService', () => {
  let service: LifterCompletedTrainingVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifterCompletedTrainingVideosService],
    }).compile();

    service = module.get<LifterCompletedTrainingVideosService>(
      LifterCompletedTrainingVideosService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
