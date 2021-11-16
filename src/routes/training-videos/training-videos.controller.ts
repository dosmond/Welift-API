import { Controller, Get, Post, Query, Body, Delete } from '@nestjs/common';
import { TrainingVideoDTO } from 'src/dto/trainingVideo.dto';
import { User } from 'src/user.decorator';
import { DeleteResult } from 'typeorm';
import { TrainingVideosService } from './training-videos.service';

@Controller('training-videos')
export class TrainingVideosController {
  constructor(private serv: TrainingVideosService) {}

  @Get('list')
  public async getAll(): Promise<TrainingVideoDTO[]> {
    return await this.serv.getAll();
  }

  @Get()
  public async getById(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<TrainingVideoDTO> {
    return await this.serv.getById(query.id);
  }

  @Post('add-video')
  public async addTrainingVideo(
    @User() user: User,
    @Body() body: TrainingVideoDTO,
  ): Promise<TrainingVideoDTO> {
    return await this.serv.addTrainingVideo(user, body);
  }

  @Delete('delete-video')
  public async deleteTrainingVideo(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<DeleteResult> {
    return await this.serv.deleteTrainingVideo(user, query.id);
  }
}
