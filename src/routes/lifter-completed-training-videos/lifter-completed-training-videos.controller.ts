import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { LifterCompletedTrainingVideoDTO } from 'src/dto/liftercompletedTrainingVideo.dto';
import { User } from 'src/user.decorator';
import { DeleteResult } from 'typeorm';
import { LifterCompletedTrainingVideosService } from './lifter-completed-training-videos.service';

@Controller('lifter-completed-training-videos')
export class LifterCompletedTrainingVideosController {
  constructor(private readonly serv: LifterCompletedTrainingVideosService) {}

  @Get()
  public async getById(
    @Query() query: { id: string },
  ): Promise<LifterCompletedTrainingVideoDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('lifter-completed')
  public async getLifterCompleted(
    @Query() query: { lifterId: string },
  ): Promise<LifterCompletedTrainingVideoDTO[]> {
    return await this.serv.getLifterCompletedVideos(query.lifterId);
  }

  @Post('create')
  public async create(
    @User() user: User,
    @Body() body: LifterCompletedTrainingVideoDTO,
  ): Promise<LifterCompletedTrainingVideoDTO> {
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
