import { Module } from '@nestjs/common';
import { CompletedLifterBadgeController } from './completed-lifter-badge.controller';
import { CompletedLifterBadgeService } from './completed-lifter-badge.service';

@Module({
  controllers: [CompletedLifterBadgeController],
  providers: [CompletedLifterBadgeService]
})
export class CompletedLifterBadgeModule {}
