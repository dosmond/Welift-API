import { SurveyResponseUpdateDTO } from './../../dto/surveyResponse.update.dto';
import { SurveyResponseDTO } from './../../dto/surveyResponse.dto';
import { SurveyResponse } from '@src/model/surveyResponse.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyService } from '../survey/survey.service';

@Injectable()
export class SurveyResponseService {
  constructor(
    @InjectRepository(SurveyResponse)
    private readonly repo: Repository<SurveyResponse>,
    private readonly surveyService: SurveyService,
  ) {}

  public async getSurveyById(surveyId: string): Promise<SurveyResponseDTO> {
    return SurveyResponseDTO.fromEntity(
      await this.repo.findOne({ id: surveyId }),
    );
  }

  public async getAllSurveyResponses(
    surveyId: string,
  ): Promise<SurveyResponseDTO[]> {
    return await this.repo
      .find({ where: { surveyId: surveyId } })
      .then((surveys) =>
        surveys.map((survey) => SurveyResponseDTO.fromEntity(survey)),
      );
  }

  public async create(request: SurveyResponseDTO): Promise<SurveyResponseDTO> {
    const dto = SurveyResponseDTO.from(request);

    const survey = await this.surveyService.getSurveyById(dto.surveyId);

    if (!survey) throw new BadRequestException('Survey does not exist');

    const remainingRefs: string[] = [];

    survey.surveyData.refs.forEach((ref) => {
      if (!Object.keys(dto.data.refs).includes(ref)) remainingRefs.push(ref);
    });

    if (remainingRefs.length > 0)
      throw new BadRequestException(
        `Missing the following refs: ${remainingRefs.join(',')}`,
      );

    return SurveyResponseDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async update(
    request: SurveyResponseUpdateDTO,
  ): Promise<SurveyResponseUpdateDTO> {
    const dto = SurveyResponseUpdateDTO.from(request);
    return SurveyResponseUpdateDTO.fromEntity(
      await this.repo.save(dto.toEntity()),
    );
  }
}
