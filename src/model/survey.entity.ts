import { SurveyAnswerType } from './../enum/surveyAnswerType.enum';
import { SurveyQuestionType } from '../enum/surveyQuestionType.enum';
import { SurveyResponse } from './surveyResponse.entity';
import { Type } from 'class-transformer';
import {
  IsUUID,
  ValidateNested,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

class Answer {
  @IsUUID()
  id: string;

  @IsEnum(SurveyAnswerType)
  type: SurveyAnswerType;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @IsString()
  placeholder: string;
}

class Question {
  @IsUUID()
  id: string;

  @IsEnum(SurveyQuestionType)
  type: SurveyQuestionType;

  @IsOptional()
  @IsBoolean()
  isOptional: boolean;

  @IsString()
  questionText: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}

export class SurveyData {
  @IsString({ each: true })
  refs: string[];

  @IsArray()
  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => Question)
  questions: Question[];
}

@Index('pk_survey', ['id'], { unique: true })
@Unique('uq_name', ['name'])
@Entity('survey', { schema: 'public' })
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name', length: 256 })
  name: string;

  @Column('json', { name: 'survey_data' })
  surveyData: SurveyData;

  @OneToMany(() => SurveyResponse, (response) => response.survey)
  responses: SurveyResponse[];
}
