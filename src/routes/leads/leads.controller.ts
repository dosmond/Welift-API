import { LeadLandingDTO } from './../../dto/lead.landing.dto';
import { LeadUpdateDTO } from 'src/dto/lead.update.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LeadDTO } from './../../dto/lead.dto';
import { LeadsService } from './leads.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { LeadThumbtackDTO } from 'src/dto/lead.thumbtack.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly serv: LeadsService) {}

  @Get()
  public async getById(@Query() query: { id: string }): Promise<LeadDTO> {
    try {
      return await this.serv.getById(query.id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  public async getAll(@Query() query: PaginatedDTO): Promise<LeadDTO[]> {
    return await this.serv.getAll(query);
  }

  @Get('count')
  public async count(): Promise<number> {
    try {
      return await this.serv.count();
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create')
  public async create(@Body() body: LeadThumbtackDTO): Promise<LeadDTO> {
    try {
      return await this.serv.createThumbtack(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create-landing')
  public async createLanding(@Body() body: LeadLandingDTO): Promise<LeadDTO> {
    try {
      return await this.serv.createLanding(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  public async update(@Body() body: LeadUpdateDTO): Promise<LeadDTO> {
    try {
      return await this.serv.update(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
