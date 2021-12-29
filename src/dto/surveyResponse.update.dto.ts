import { SurveyResponseDTO } from './surveyResponse.dto';
import { SurveyResponseData } from '../model/surveyResponse.entity';
import {
  IsDateString,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SurveyResponse } from 'src/model/surveyResponse.entity';
import { Survey } from 'src/model/survey.entity';

export class SurveyResponseUpdateDTO
  implements Readonly<SurveyResponseUpdateDTO>, SurveyResponseDTO
{
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  surveyId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyResponseData)
  data: SurveyResponseData;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  creationDate: Date;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => Survey)
  survey: Survey;

  public static from(dto: Partial<SurveyResponseUpdateDTO>) {
    const survey = new SurveyResponseUpdateDTO();
    for (const property in dto) survey[property] = dto[property];

    return survey;
  }

  public static fromEntity(entity: SurveyResponse) {
    if (entity) {
      return this.from({
        id: entity.id,
        surveyId: entity.surveyId,
        data: entity.data,
        creationDate: entity.creationDate,
        survey: entity.survey,
      });
    }
    return null;
  }

  public toEntity() {
    const survey = new SurveyResponse();
    for (const property in this as SurveyResponseUpdateDTO)
      survey[property] = this[property];
    return survey;
  }
}
