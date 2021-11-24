import { LifterEquipmentService } from './lifter-equipment.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { LifterEquipmentDTO } from 'src/dto/lifterEquipment.dto';
import { User } from 'src/user.decorator';
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';

@Controller('lifter-equipment')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Lifter)
export class LifterEquipmentController {
  constructor(private readonly serv: LifterEquipmentService) {}

  @Get('lifter')
  public async getLifterEquipment(
    @Query() query: { lifterId: string },
  ): Promise<LifterEquipmentDTO[]> {
    try {
      return await this.serv.getLifterEquipment(query.lifterId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create')
  public async create(
    @User() user: User,
    @Body() body: LifterEquipmentDTO,
  ): Promise<LifterEquipmentDTO> {
    try {
      return await this.serv.create(user, body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Delete('delete')
  public async delete(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<DeleteResult> {
    try {
      return await this.serv.delete(user, query.id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
