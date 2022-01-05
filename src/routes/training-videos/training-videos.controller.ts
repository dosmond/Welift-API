import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@src/auth/roles/roles.decorator';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { TrainingVideoDTO } from '@src/dto/trainingVideo.dto';
import { Role } from '@src/enum/roles.enum';
import { User } from '@src/user.decorator';
import { DeleteResult } from 'typeorm';
import { TrainingVideosService } from './training-videos.service';

@Controller('training-video')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TrainingVideosController {
  constructor(private serv: TrainingVideosService) {}

  @Get('list')
  @Roles(Role.Lifter)
  public async getAll(): Promise<TrainingVideoDTO[]> {
    return await this.serv.getAll();
  }

  @Get()
  @Roles(Role.Lifter)
  public async getById(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<TrainingVideoDTO> {
    try {
      return await this.serv.getById(query.id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('create')
  @Roles(Role.Admin)
  public async addTrainingVideo(
    @User() user: User,
    @Body() body: TrainingVideoDTO,
  ): Promise<TrainingVideoDTO> {
    return await this.serv.addTrainingVideo(user, body);
  }

  @Delete('delete')
  @Roles(Role.Admin)
  public async deleteTrainingVideo(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<DeleteResult> {
    return await this.serv.deleteTrainingVideo(user, query.id);
  }
}
