import {
  IsArray,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyData, Survey } from '@src/model/survey.entity';
import { Type } from 'class-transformer';
import { SurveyResponse } from '@src/model/surveyResponse.entity';

export class SurveyDTO implements Readonly<SurveyDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SurveyData)
  surveyData: SurveyData;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyResponse)
  responses: SurveyResponse[];

  public static from(dto: Partial<SurveyDTO>) {
    const survey = new SurveyDTO();
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

  public toEntity() {
    const survey = new Survey();
    for (const property in this as SurveyDTO) survey[property] = this[property];
    return survey;
  }
}
