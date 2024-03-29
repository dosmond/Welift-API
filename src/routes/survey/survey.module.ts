import { AuthModule } from './../../auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { Survey } from '@src/model/survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey]), AuthModule],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
