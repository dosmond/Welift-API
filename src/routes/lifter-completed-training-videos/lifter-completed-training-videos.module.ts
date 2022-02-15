import { AuthModule } from './../../auth/auth.module';
import { LifterCompletedTrainingVideo } from './../../model/lifterCompletedTrainingVideos.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifterCompletedTrainingVideosController } from './lifter-completed-training-videos.controller';
import { LifterCompletedTrainingVideosService } from './lifter-completed-training-videos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LifterCompletedTrainingVideo]),
    AuthModule,
  ],
  controllers: [LifterCompletedTrainingVideosController],
  providers: [LifterCompletedTrainingVideosService],
})
export class LifterCompletedTrainingVideosModule {}
