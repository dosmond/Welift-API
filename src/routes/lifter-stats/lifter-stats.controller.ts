import { LifterStatsUpdateDTO } from './../../dto/lifterStats.update.dto';
import { LifterStatsDTO } from './../../dto/lifterStats.dto';
import { LifterStatsService } from './lifter-stats.service';
import { Body, Controller, Get, Put, Query } from '@nestjs/common';

@Controller('lifter-stats')
export class LifterStatsController {
  constructor(private readonly serv: LifterStatsService) {}

  @Get('lifter')
  public async getLifterStats(
    @Query() query: { lifterId: string },
  ): Promise<LifterStatsDTO> {
    return await this.serv.getLifterStats(query.lifterId);
  }

  @Put('update')
  public async update(
    @Body() body: LifterStatsUpdateDTO,
  ): Promise<LifterStatsDTO> {
    return await this.serv.update(body);
  }
}
