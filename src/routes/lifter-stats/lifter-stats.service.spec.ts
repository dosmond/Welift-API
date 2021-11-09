import { Test, TestingModule } from '@nestjs/testing';
import { LifterStatsService } from './lifter-stats.service';

describe('LifterStatsService', () => {
  let service: LifterStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifterStatsService],
    }).compile();

    service = module.get<LifterStatsService>(LifterStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
