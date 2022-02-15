import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterCompletedTrainingVideo } from '@src/model/lifterCompletedTrainingVideos.entity';
import { TrainingVideo } from '@src/model/TrainingVideos.entity';
import { TrainingVideosController } from './training-videos.controller';
import { TrainingVideosService } from './training-videos.service';

describe('TrainingVideosController', () => {
  let controller: TrainingVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([TrainingVideo, LifterCompletedTrainingVideo]),
        AuthModule,
      ],
      controllers: [TrainingVideosController],
      providers: [TrainingVideosService],
    }).compile();

    controller = module.get<TrainingVideosController>(TrainingVideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
