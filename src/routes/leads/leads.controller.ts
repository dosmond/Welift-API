import { LeadUpdateDTO } from 'src/dto/lead.update.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LeadDTO } from './../../dto/lead.dto';
import { LeadsService } from './leads.service';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';

@Controller('leads')
export class LeadsController {
  constructor(private readonly serv: LeadsService) {}

  @Get()
  public async getById(@Query() query: { id: string }): Promise<LeadDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('list')
  public async getAll(@Query() query: PaginatedDTO): Promise<LeadDTO[]> {
    return await this.serv.getAll(query);
  }

  @Get('count')
  public async count(): Promise<number> {
    return await this.serv.count();
  }

  @Post('create')
  public async create(@Body() body: LeadDTO): Promise<LeadDTO> {
    return await this.serv.create(body);
  }

  @Put('update')
  public async update(@Body() body: LeadUpdateDTO): Promise<LeadDTO> {
    return await this.serv.update(body);
  }
}
