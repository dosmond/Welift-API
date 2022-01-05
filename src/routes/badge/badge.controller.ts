import { BadgeDTO } from './../../dto/badge.dto';
import { BadgeService } from './badge.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { BadgeUpdateDTO } from '@src/dto/badge.update.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { Role } from '@src/enum/roles.enum';
import { Roles } from '@src/auth/roles/roles.decorator';

@Controller('badge')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BadgeController {
  constructor(private readonly serv: BadgeService) {}

  @Get()
  @Roles(Role.Lifter)
  public async getById(@Query() query: { id: string }): Promise<BadgeDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('list')
  @Roles(Role.Lifter)
  public async getAll(): Promise<BadgeDTO[]> {
    return await this.serv.getAll();
  }

  @Post('create')
  @Roles(Role.Admin)
  public async create(@Body() body: BadgeDTO): Promise<BadgeDTO> {
    try {
      return await this.serv.create(body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  @Roles(Role.Admin)
  public async update(@Body() body: BadgeUpdateDTO): Promise<BadgeDTO> {
    try {
      return await this.serv.update(body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
