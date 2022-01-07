import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterCompletedTrainingVideo } from '@src/model/lifterCompletedTrainingVideos.entity';
import { LifterCompletedTrainingVideosController } from './lifter-completed-training-videos.controller';
import { LifterCompletedTrainingVideosService } from './lifter-completed-training-videos.service';

describe('LifterCompletedTrainingVideosService', () => {
  let service: LifterCompletedTrainingVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterCompletedTrainingVideo]),
      ],
      controllers: [LifterCompletedTrainingVideosController],
      providers: [LifterCompletedTrainingVideosService],
    }).compile();

    service = module.get<LifterCompletedTrainingVideosService>(
      LifterCompletedTrainingVideosService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
