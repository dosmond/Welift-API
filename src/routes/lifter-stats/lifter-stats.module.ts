import { Module } from '@nestjs/common';
import { LifterStatsController } from './lifter-stats.controller';
import { LifterStatsService } from './lifter-stats.service';

@Module({
  controllers: [LifterStatsController],
  providers: [LifterStatsService]
})
export class LifterStatsModule {}
