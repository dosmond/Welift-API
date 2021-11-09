import { Module } from '@nestjs/common';
import { LifterReviewsController } from './lifter-reviews.controller';
import { LifterReviewsService } from './lifter-reviews.service';

@Module({
  controllers: [LifterReviewsController],
  providers: [LifterReviewsService]
})
export class LifterReviewsModule {}
