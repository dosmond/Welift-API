import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@src/auth/roles/roles.decorator';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { LifterCompletedTrainingVideoDTO } from '@src/dto/liftercompletedTrainingVideo.dto';
import { Role } from '@src/enum/roles.enum';
import { User } from '@src/user.decorator';
import { DeleteResult } from 'typeorm';
import { LifterCompletedTrainingVideosService } from './lifter-completed-training-videos.service';

@Controller('completed-videos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LifterCompletedTrainingVideosController {
  constructor(private readonly serv: LifterCompletedTrainingVideosService) {}

  @Get()
  @Roles(Role.Lifter)
  public async getById(
    @Query() query: { id: string },
  ): Promise<LifterCompletedTrainingVideoDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('lifter')
  @Roles(Role.Lifter)
  public async getLifterCompleted(
    @Query() query: { lifterId: string },
  ): Promise<LifterCompletedTrainingVideoDTO[]> {
    return await this.serv.getLifterCompletedVideos(query.lifterId);
  }

  @Post('create')
  @Roles(Role.Lifter)
  public async create(
    @User() user: User,
    @Body() body: LifterCompletedTrainingVideoDTO,
  ): Promise<LifterCompletedTrainingVideoDTO> {
    return await this.serv.create(user, body);
  }

  @Delete('delete')
  @Roles(Role.Lifter)
  public async delete(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<DeleteResult> {
    return await this.serv.delete(user, query.id);
  }
}
