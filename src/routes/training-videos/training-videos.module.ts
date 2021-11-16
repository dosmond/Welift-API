import { TrainingVideo } from './../../model/TrainingVideos.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingVideosController } from './training-videos.controller';
import { TrainingVideosService } from './training-videos.service';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingVideo])],
  controllers: [TrainingVideosController],
  providers: [TrainingVideosService],
})
export class TrainingVideosModule {}
