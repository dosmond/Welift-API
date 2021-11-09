import { Module } from '@nestjs/common';
import { LifterCompletedTrainingVideosController } from './lifter-completed-training-videos.controller';

@Module({
  controllers: [LifterCompletedTrainingVideosController]
})
export class LifterCompletedTrainingVideosModule {}
