import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyData, Survey } from 'src/model/survey.entity';
import { Type } from 'class-transformer';
import { SurveyResponse } from 'src/model/surveyResponse.entity';
import { SurveyDTO } from './survey.dto';

export class SurveyUpdateDTO implements Readonly<SurveyUpdateDTO>, SurveyDTO {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyData)
  surveyData: SurveyData;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyResponse)
  responses: SurveyResponse[];

  public static from(dto: Partial<SurveyUpdateDTO>) {
    const survey = new SurveyUpdateDTO();
    for (const property in dto) survey[property] = dto[property];

    return survey;
  }

  public static fromEntity(entity: Survey) {
    if (entity) {
      return this.from({
        id: entity.id,
        name: entity.name,
        surveyData: entity.surveyData,
        responses: entity.responses,
      });
    }
    return null;
  }

  public toEntity(): Survey {
    const survey = new Survey();
    for (const property in this as SurveyUpdateDTO)
      survey[property] = this[property];
    return survey;
  }
}
