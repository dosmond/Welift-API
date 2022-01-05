import { SurveyResponseData } from '../model/surveyResponse.entity';
import {
  IsDateString,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SurveyResponse } from '@src/model/surveyResponse.entity';
import { Survey } from '@src/model/survey.entity';

export class SurveyResponseDTO implements Readonly<SurveyResponseDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsUUID()
  surveyId: string;

  @ApiProperty({ required: true })
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

  public static from(dto: Partial<SurveyResponseDTO>) {
    const survey = new SurveyResponseDTO();
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
    for (const property in this as SurveyResponseDTO)
      survey[property] = this[property];
    return survey;
  }
}
