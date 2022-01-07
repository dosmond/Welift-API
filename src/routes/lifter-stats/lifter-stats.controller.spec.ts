import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterStats } from '@src/model/lifterStats.entity';
import { LifterStatsController } from './lifter-stats.controller';
import { LifterStatsService } from './lifter-stats.service';

describe('LifterStatsController', () => {
  let controller: LifterStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterStats]),
      ],
      controllers: [LifterStatsController],
      providers: [LifterStatsService],
    }).compile();

    controller = module.get<LifterStatsController>(LifterStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
