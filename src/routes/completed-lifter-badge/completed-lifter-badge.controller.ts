import { CompletedLifterBadgeService } from './completed-lifter-badge.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompletedLifterBadgeDTO } from '@src/dto/completeLifterBadge.dto';
import { User } from '@src/user.decorator';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { Roles } from '@src/auth/roles/roles.decorator';
import { Role } from '@src/enum/roles.enum';

@Controller('completed-badge')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CompletedLifterBadgeController {
  constructor(private readonly serv: CompletedLifterBadgeService) {}

  @Get()
  @Roles(Role.Lifter)
  public async getById(
    @Query() query: { id: string },
  ): Promise<CompletedLifterBadgeDTO> {
    return await this.serv.getById(query.id);
  }

  @Post('create')
  @Roles(Role.Lifter)
  public async create(
    @User() user: User,
    @Body() body: CompletedLifterBadgeDTO,
  ): Promise<CompletedLifterBadgeDTO> {
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
