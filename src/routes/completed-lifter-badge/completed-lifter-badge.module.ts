import { CompletedLifterBadge } from './../../model/completedLifterBadges.entity';
import { Module } from '@nestjs/common';
import { CompletedLifterBadgeController } from './completed-lifter-badge.controller';
import { CompletedLifterBadgeService } from './completed-lifter-badge.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CompletedLifterBadge])],
  controllers: [CompletedLifterBadgeController],
  providers: [CompletedLifterBadgeService],
})
export class CompletedLifterBadgeModule {}
