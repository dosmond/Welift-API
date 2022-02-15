import { AuthModule } from './../../auth/auth.module';
import { SurveyResponse } from '@src/model/surveyResponse.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyResponseController } from './survey-response.controller';
import { SurveyResponseService } from './survey-response.service';
import { SurveyService } from '../survey/survey.service';
import { Survey } from '@src/model/survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyResponse, Survey]), AuthModule],
  controllers: [SurveyResponseController],
  providers: [SurveyResponseService, SurveyService],
})
export class SurveyResponseModule {}
