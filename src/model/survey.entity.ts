import { SurveyResponse } from './surveyResponse.entity';
import { Type } from 'class-transformer';
import {
  IsUUID,
  ValidateNested,
  IsString,
  IsOptional,
  IsBoolean,
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

  @IsString()
  type: 'check' | 'text' | 'textarea' | 'number';

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  placeholder: string;
}

class Question {
  @IsUUID()
  id: string;

  @IsString()
  type: 'multiple' | 'radio';

  @IsOptional()
  @IsBoolean()
  isOptional: boolean;

  @IsString()
  questionText: string;

  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}

export class SurveyData {
  @ValidateNested({ each: true })
  @Type(() => String)
  refs: string[];

  @ValidateNested()
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
