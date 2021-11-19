import { LifterUpdateBatchDTO } from './../../dto/lifter.update.batch.dto';
import { LifterBatchDTO } from './../../dto/lifter.batch.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LiftersService } from './lifters.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { LifterDTO } from 'src/dto/lifter.dto';
import { User } from 'src/user.decorator';

@Controller('lifter')
export class LiftersController {
  constructor(private readonly serv: LiftersService) {}

  @Get()
  public async getById(
    @User() user: User,
    @Query() query: { id: string; userId: string },
  ): Promise<LifterDTO> {
    try {
      if (query.id) return await this.serv.getById(user, query.id);
      return await this.serv.getByUserId(user, query.userId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  public async getAll(@Query() query: PaginatedDTO): Promise<LifterDTO[]> {
    try {
      return await this.serv.getAll(query);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
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

  @Post('create-batch')
  public async createBatch(@Body() body: LifterBatchDTO): Promise<LifterDTO> {
    try {
      return await this.serv.createBatch(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('upsert')
  public async updateBatch(
    @Body() body: LifterUpdateBatchDTO,
  ): Promise<LifterDTO> {
    try {
      return await this.serv.updateBatch(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
