import { SurveyUpdateDTO } from './../../dto/survey.update.dto';
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
import { Roles } from '@src/auth/roles/roles.decorator';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { SurveyDTO } from '@src/dto/survey.dto';
import { Role } from '@src/enum/roles.enum';
import { SurveyService } from './survey.service';

@Controller('survey')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SurveyController {
  constructor(private readonly serv: SurveyService) {}

  @Get()
  @Roles(Role.Admin)
  public async getSurveyById(
    @Query() query: { surveyId: string },
  ): Promise<SurveyDTO> {
    try {
      return await this.serv.getSurveyById(query.surveyId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  @Roles(Role.Admin)
  public async getAllSurveys(): Promise<SurveyDTO[]> {
    try {
      return await this.serv.getAllSurveys();
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create')
  @Roles(Role.Admin)
  public create(@Body() body: SurveyDTO): Promise<SurveyDTO> {
    try {
      return this.serv.create(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  @Roles(Role.Admin)
  public update(@Body() body: SurveyUpdateDTO): Promise<SurveyUpdateDTO> {
    try {
      return this.serv.update(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
