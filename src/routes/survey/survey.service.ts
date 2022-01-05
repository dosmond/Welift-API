import { SurveyUpdateDTO } from './../../dto/survey.update.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyDTO } from '@src/dto/survey.dto';
import { Survey } from '@src/model/survey.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly repo: Repository<Survey>,
  ) {}

  public async getSurveyById(surveyId: string): Promise<SurveyDTO> {
    return SurveyDTO.fromEntity(await this.repo.findOne({ id: surveyId }));
  }

  public async getAllSurveys(): Promise<SurveyDTO[]> {
    return await this.repo
      .find()
      .then((surveys) => surveys.map((survey) => SurveyDTO.fromEntity(survey)));
  }

  public async create(request: SurveyDTO): Promise<SurveyDTO> {
    const dto = SurveyDTO.from(request);
    return SurveyDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async update(request: SurveyUpdateDTO): Promise<SurveyUpdateDTO> {
    const dto = SurveyUpdateDTO.from(request);
    return SurveyUpdateDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }
}
