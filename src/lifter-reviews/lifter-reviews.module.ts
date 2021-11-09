import { Module } from '@nestjs/common';
import { LifterReviewsController } from './lifter-reviews.controller';

@Module({
  controllers: [LifterReviewsController]
})
export class LifterReviewsModule {}
