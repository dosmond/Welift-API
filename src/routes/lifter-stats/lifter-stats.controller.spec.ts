import { Test, TestingModule } from '@nestjs/testing';
import { LifterStatsController } from './lifter-stats.controller';

describe('LifterStatsController', () => {
  let controller: LifterStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifterStatsController],
    }).compile();

    controller = module.get<LifterStatsController>(LifterStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
