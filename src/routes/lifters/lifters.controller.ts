import { LifterBatchDTO } from './../../dto/lifter.batch.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LiftersService } from './lifters.service';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { LifterDTO } from 'src/dto/lifter.dto';
import { User } from 'src/user.decorator';

@Controller('lifters')
export class LiftersController {
  constructor(private readonly serv: LiftersService) {}

  @Get()
  public async getById(
    @User() user: User,
    @Query() query: { id: string; userId: string },
  ): Promise<LifterDTO> {
    if (query.id) return await this.serv.getById(user, query.id);
    return await this.serv.getByUserId(user, query.userId);
  }

  @Get('list')
  public async getAll(@Query() query: PaginatedDTO): Promise<LifterDTO[]> {
    return await this.serv.getAll(query);
  }

  @Get('count')
  public async count(): Promise<number> {
    return await this.serv.count();
  }

  @Post('create-batch')
  public async createBatch(@Body() body: LifterBatchDTO): Promise<LifterDTO> {
    return await this.serv.createBatch(body);
  }

  @Put('upsert')
  public async updateBatch(@Body() body: LifterBatchDTO): Promise<LifterDTO> {
    return await this.serv.updateBatch(body);
  }
}
