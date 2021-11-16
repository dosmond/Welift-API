import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { TrainingVideoDTO } from 'src/dto/trainingVideo.dto';
import { Role } from 'src/enum/roles.enum';
import { TrainingVideosService } from './training-videos.service';

@Controller('training-videos')
export class TrainingVideosController {
  constructor(private serv: TrainingVideosService) {}

  @Get()
  public async getAll(): Promise<TrainingVideoDTO[]> {
    return await this.serv.getAll();
  }
}
