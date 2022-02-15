import { AuthModule } from './../../auth/auth.module';
import { LifterReview } from './../../model/lifterReviews.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifterReviewsController } from './lifter-reviews.controller';
import { LifterReviewsService } from './lifter-reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([LifterReview]), AuthModule],
  controllers: [LifterReviewsController],
  providers: [LifterReviewsService],
})
export class LifterReviewsModule {}
