import { NoteUpdateDTO } from './../../dto/note.update.dto';
import { NoteDTO } from './../../dto/note.dto';
import { NoteService } from './note.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { Roles } from '@src/auth/roles/roles.decorator';
import { Role } from '@src/enum/roles.enum';

@Controller('note')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NoteController {
  constructor(private readonly serv: NoteService) {}

  @Get()
  @Roles(Role.Admin, Role.Rep)
  public async getById(
    @Query() query: { bookingId: string; leadId: string },
  ): Promise<NoteDTO[]> {
    if (query.bookingId) return await this.serv.getByBooking(query.bookingId);
    if (query.leadId) return await this.serv.getByLead(query.leadId);
  }

  @Post('create')
  @Roles(Role.Admin, Role.Rep)
  public async create(@Body() body: NoteDTO): Promise<NoteDTO> {
    return await this.serv.create(body);
  }

  @Put('update')
  @Roles(Role.Admin)
  public async update(@Body() body: NoteUpdateDTO): Promise<NoteDTO> {
    return await this.serv.update(body);
  }

  @Put('update-lead-to-booking')
  @Roles(Role.Admin)
  public async updateLeadToBooking(
    @Query() query: { leadId: string; bookingId: string },
  ): Promise<UpdateResult> {
    return await this.serv.updateLeadToBooking(query.leadId, query.bookingId);
  }

  @Delete('delete')
  @Roles(Role.Admin)
  public async delete(@Query() query: { id: string }): Promise<DeleteResult> {
    return await this.serv.delete(query.id);
  }

  @Delete('delete-by-booking')
  @Roles(Role.Admin)
  public async deleteByBooking(
    @Query() query: { bookingId: string },
  ): Promise<DeleteResult> {
    return await this.serv.deleteByBooking(query.bookingId);
  }
}
