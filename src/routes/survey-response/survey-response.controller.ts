import { SurveyResponseDTO } from './../../dto/surveyResponse.dto';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  Body,
  Post,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { Role } from 'src/enum/roles.enum';
import { SurveyResponseService } from './survey-response.service';
import { SurveyResponseUpdateDTO } from 'src/dto/surveyResponse.update.dto';

@Controller('survey-response')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SurveyResponseController {
  constructor(private readonly serv: SurveyResponseService) {}

  @Get()
  @Roles(Role.Admin)
  public async getSurveyResponseById(
    @Query() query: { responseId: string },
  ): Promise<SurveyResponseDTO> {
    try {
      return await this.serv.getSurveyById(query.responseId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  @Roles(Role.Admin)
  public async getAllSurveyResponses(
    @Query() query: { surveyId: string },
  ): Promise<SurveyResponseDTO[]> {
    try {
      return await this.serv.getAllSurveyResponses(query.surveyId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create')
  @Roles(Role.Admin)
  public create(@Body() body: SurveyResponseDTO): Promise<SurveyResponseDTO> {
    try {
      return this.serv.create(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  @Roles(Role.Admin)
  public update(
    @Body() body: SurveyResponseUpdateDTO,
  ): Promise<SurveyResponseUpdateDTO> {
    try {
      return this.serv.update(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
