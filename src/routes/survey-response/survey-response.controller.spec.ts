import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Survey } from '@src/model/survey.entity';
import { SurveyResponse } from '@src/model/surveyResponse.entity';
import { SurveyService } from '../survey/survey.service';
import { SurveyResponseController } from './survey-response.controller';
import { SurveyResponseService } from './survey-response.service';

describe('SurveyResponseController', () => {
  let controller: SurveyResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([SurveyResponse, Survey]),
        AuthModule,
      ],
      controllers: [SurveyResponseController],
      providers: [SurveyResponseService, SurveyService],
    }).compile();

    controller = module.get<SurveyResponseController>(SurveyResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
