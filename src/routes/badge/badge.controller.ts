import { BadgeDTO } from './../../dto/badge.dto';
import { BadgeService } from './badge.service';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { BadgeUpdateDTO } from 'src/dto/badge.update.dto';

@Controller('badge')
export class BadgeController {
  constructor(private readonly serv: BadgeService) { }

  @Get()
  public async getById(@Query() query: { id: string }): Promise<BadgeDTO> {
    return await this.serv.getById(query.id)
  }

  @Get('list')
  public async getAll(): Promise<BadgeDTO[]> {
    return await this.serv.getAll()
  }

  @Post('create')
  public async create(@Body() body: BadgeDTO): Promise<BadgeDTO> {
    return await this.serv.create(body)
  }

  @Put('update')
  public async update(@Body() body: BadgeUpdateDTO): Promise<BadgeDTO> {
    return await this.serv.update(body)
  }
}
