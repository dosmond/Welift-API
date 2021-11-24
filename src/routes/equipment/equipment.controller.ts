import { EquipmentUpdateDTO } from './../../dto/equipment.update.dto';
import { EquipmentService } from './equipment.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EquipmentDTO } from 'src/dto/equipment.dto';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('equipment')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EquipmentController {
  constructor(private readonly serv: EquipmentService) {}

  @Get()
  @Roles(Role.Lifter)
  public async getById(@Query() query: { id: string }): Promise<EquipmentDTO> {
    try {
      return await this.serv.getById(query.id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  @Roles(Role.Lifter)
  public async getAll(): Promise<EquipmentDTO[]> {
    return await this.serv.getAll();
  }

  @Post('create')
  @Roles(Role.Admin)
  public async create(@Body() body: EquipmentDTO): Promise<EquipmentDTO> {
    try {
      return await this.serv.create(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  @Roles(Role.Admin)
  public async update(@Body() body: EquipmentUpdateDTO): Promise<EquipmentDTO> {
    try {
      return await this.serv.update(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Delete('delete')
  @Roles(Role.Admin)
  public async delete(@Query() query: { id: string }): Promise<DeleteResult> {
    return await this.serv.delete(query.id);
  }
}
