import { Test, TestingModule } from '@nestjs/testing';
import { TrainingVideosService } from './training-videos.service';

describe('TrainingVideosService', () => {
  let service: TrainingVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingVideosService],
    }).compile();

    service = module.get<TrainingVideosService>(TrainingVideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
