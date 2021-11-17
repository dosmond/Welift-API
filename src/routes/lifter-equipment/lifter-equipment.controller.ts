import { LifterEquipmentService } from './lifter-equipment.service';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { LifterEquipmentDTO } from 'src/dto/lifterEquipment.dto';
import { User } from 'src/user.decorator';
import { DeleteResult } from 'typeorm';

@Controller('lifter-equipment')
export class LifterEquipmentController {
  constructor(private readonly serv: LifterEquipmentService) {}

  @Get('lifter')
  public async getLifterEquipment(
    @Query() query: { lifterId: string },
  ): Promise<LifterEquipmentDTO[]> {
    return await this.serv.getLifterEquipment(query.lifterId);
  }

  @Post('create')
  public async create(
    @User() user: User,
    @Body() body: LifterEquipmentDTO,
  ): Promise<LifterEquipmentDTO> {
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
