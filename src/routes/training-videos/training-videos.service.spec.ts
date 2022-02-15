import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterCompletedTrainingVideo } from '@src/model/lifterCompletedTrainingVideos.entity';
import { TrainingVideo } from '@src/model/TrainingVideos.entity';
import { TrainingVideosService } from './training-videos.service';

describe('TrainingVideosService', () => {
  let service: TrainingVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([TrainingVideo, LifterCompletedTrainingVideo]),
        AuthModule,
      ],
      providers: [TrainingVideosService],
    }).compile();

    service = module.get<TrainingVideosService>(TrainingVideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
