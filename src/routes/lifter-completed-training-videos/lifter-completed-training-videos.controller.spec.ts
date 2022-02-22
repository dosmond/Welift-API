import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterCompletedTrainingVideo } from '@src/model/lifterCompletedTrainingVideos.entity';
import { LifterCompletedTrainingVideosController } from './lifter-completed-training-videos.controller';
import { LifterCompletedTrainingVideosService } from './lifter-completed-training-videos.service';

describe('LifterCompletedTrainingVideosController', () => {
  let controller: LifterCompletedTrainingVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterCompletedTrainingVideo]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      controllers: [LifterCompletedTrainingVideosController],
      providers: [LifterCompletedTrainingVideosService],
    }).compile();

    controller = module.get<LifterCompletedTrainingVideosController>(
      LifterCompletedTrainingVideosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
