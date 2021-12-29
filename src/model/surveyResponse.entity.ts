import { Type } from 'class-transformer';
import { IsUUID, ValidateNested, IsOptional, IsObject } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Survey } from './survey.entity';

class Answer {
  @IsUUID()
  id: string;

  @IsOptional()
  value: string | number;
}

class Response {
  @IsUUID()
  questionId: string;

  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}

export class SurveyResponseData {
  @IsObject()
  refs: any;

  @ValidateNested()
  @Type(() => Response)
  questions: Response[];

  @IsOptional()
  @IsObject()
  metadata: any;
}

@Index('pk_survey_response', ['id'], { unique: true })
@Entity('survey_response', { schema: 'public' })
export class SurveyResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'survey_id' })
  surveyId: string;

  @Column('json', { name: 'data' })
  data: SurveyResponseData;

  @ManyToOne(() => Survey, (survey) => survey.responses)
  @JoinColumn([{ name: 'survey_id', referencedColumnName: 'id' }])
  survey: Survey;
}
