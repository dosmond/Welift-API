import { Type } from 'class-transformer';
import {
  IsUUID,
  ValidateNested,
  IsOptional,
  IsObject,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}

export class SurveyResponseData {
  @IsObject()
  refs: any;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => Response)
  questions: Response[];

  @IsOptional()
  @IsObject()
  metadata: any;
}

@Index('pk_survey_response', ['id'], { unique: true })
@Index('fk_survey_id', ['surveyId'], {})
@Entity('survey_response', { schema: 'public' })
export class SurveyResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'survey_id' })
  surveyId: string;

  @Column('json', { name: 'data' })
  data: SurveyResponseData;

  @Column('timestamptz', {
    name: 'creation_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate: Date;

  @ManyToOne(() => Survey, (survey) => survey.responses)
  @JoinColumn([{ name: 'survey_id', referencedColumnName: 'id' }])
  survey: Survey;
}
