import { Module } from '@nestjs/common';
import { CompletedLifterBadgeController } from './completed-lifter-badge.controller';

@Module({
  controllers: [CompletedLifterBadgeController]
})
export class CompletedLifterBadgeModule {}
