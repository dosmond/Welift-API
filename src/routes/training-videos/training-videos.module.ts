import { AuthModule } from './../../auth/auth.module';
import { LifterCompletedTrainingVideo } from './../../model/lifterCompletedTrainingVideos.entity';
import { TrainingVideo } from './../../model/TrainingVideos.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingVideosController } from './training-videos.controller';
import { TrainingVideosService } from './training-videos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingVideo, LifterCompletedTrainingVideo]),
    AuthModule,
  ],
  controllers: [TrainingVideosController],
  providers: [TrainingVideosService],
})
export class TrainingVideosModule {}
