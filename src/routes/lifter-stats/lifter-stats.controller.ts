import { LifterStatsUpdateDTO } from './../../dto/lifterStats.update.dto';
import { LifterStatsDTO } from './../../dto/lifterStats.dto';
import { LifterStatsService } from './lifter-stats.service';
import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { Roles } from '@src/auth/roles/roles.decorator';
import { Role } from '@src/enum/roles.enum';

@Controller('lifter-stats')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LifterStatsController {
  constructor(private readonly serv: LifterStatsService) {}

  @Get('lifter')
  @Roles(Role.Lifter)
  public async getLifterStats(
    @Query() query: { lifterId: string },
  ): Promise<LifterStatsDTO> {
    return await this.serv.getLifterStats(query.lifterId);
  }

  @Put('update')
  @Roles(Role.Lifter)
  public async update(
    @Body() body: LifterStatsUpdateDTO,
  ): Promise<LifterStatsDTO> {
    return await this.serv.update(body);
  }
}
