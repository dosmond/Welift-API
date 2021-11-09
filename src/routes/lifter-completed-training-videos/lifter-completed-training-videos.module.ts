import { Module } from '@nestjs/common';
import { LifterCompletedTrainingVideosController } from './lifter-completed-training-videos.controller';
import { LifterCompletedTrainingVideosService } from './lifter-completed-training-videos.service';

@Module({
  controllers: [LifterCompletedTrainingVideosController],
  providers: [LifterCompletedTrainingVideosService]
})
export class LifterCompletedTrainingVideosModule {}
