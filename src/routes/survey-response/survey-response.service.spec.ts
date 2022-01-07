import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Survey } from '@src/model/survey.entity';
import { SurveyResponse } from '@src/model/surveyResponse.entity';
import { SurveyService } from '../survey/survey.service';
import { SurveyResponseService } from './survey-response.service';

describe('SurveyResponsewService', () => {
  let service: SurveyResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([SurveyResponse, Survey]),
      ],
      providers: [SurveyResponseService, SurveyService],
    }).compile();

    service = module.get<SurveyResponseService>(SurveyResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
