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
} from '@nestjs/common';
import { EquipmentDTO } from 'src/dto/equipment.dto';
import { DeleteResult } from 'typeorm';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly serv: EquipmentService) {}

  @Get()
  public async getById(@Query() query: { id: string }): Promise<EquipmentDTO> {
    try {
      return await this.serv.getById(query.id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  public async getAll(): Promise<EquipmentDTO[]> {
    return await this.serv.getAll();
  }

  @Post('create')
  public async create(@Body() body: EquipmentDTO): Promise<EquipmentDTO> {
    try {
      return await this.serv.create(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  public async update(@Body() body: EquipmentUpdateDTO): Promise<EquipmentDTO> {
    try {
      return await this.serv.update(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Delete('delete')
  public async delete(@Query() query: { id: string }): Promise<DeleteResult> {
    return await this.serv.delete(query.id);
  }
}
