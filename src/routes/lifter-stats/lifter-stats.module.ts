import { AuthModule } from './../../auth/auth.module';
import { LifterStats } from './../../model/lifterStats.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifterStatsController } from './lifter-stats.controller';
import { LifterStatsService } from './lifter-stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([LifterStats]), AuthModule],
  controllers: [LifterStatsController],
  providers: [LifterStatsService],
})
export class LifterStatsModule {}
