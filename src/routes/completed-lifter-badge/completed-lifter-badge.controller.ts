import { CompletedLifterBadgeService } from './completed-lifter-badge.service';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CompletedLifterBadgeDTO } from 'src/dto/completeLifterBadge.dto';
import { User } from 'src/user.decorator';
import { DeleteResult } from 'typeorm';

@Controller('completed-badge')
export class CompletedLifterBadgeController {
  constructor(private readonly serv: CompletedLifterBadgeService) {}

  @Get()
  public async getById(
    @Query() query: { id: string },
  ): Promise<CompletedLifterBadgeDTO> {
    return await this.serv.getById(query.id);
  }

  @Post('create')
  public async create(
    @User() user: User,
    @Body() body: CompletedLifterBadgeDTO,
  ): Promise<CompletedLifterBadgeDTO> {
    return await this.serv.create(user, body);
  }

  @Delete('delete')
  public async delete(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<DeleteResult> {
    return await this.serv.delete(user, query.id);
  }
}
