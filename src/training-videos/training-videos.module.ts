import { Module } from '@nestjs/common';
import { TrainingVideosController } from './training-videos.controller';

@Module({
  controllers: [TrainingVideosController]
})
export class TrainingVideosModule {}
