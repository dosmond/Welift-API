import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterStats } from '@src/model/lifterStats.entity';
import { LifterStatsService } from './lifter-stats.service';

describe('LifterStatsService', () => {
  let service: LifterStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterStats]),
      ],
      providers: [LifterStatsService],
    }).compile();

    service = module.get<LifterStatsService>(LifterStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
