import { Roles } from 'src/auth/roles/roles.decorator';
import { TextClient } from '../../helper/text.client';
import { BookingDTO } from 'src/dto/booking.dto';
import { BookingService } from './booking.service';
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
import { BookingBatchDTO } from 'src/dto/booking.batch.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { BookingConfirmTextDTO } from 'src/dto/bookingConfirmText.dto';
import { BookingUpdateDTO } from 'src/dto/booking.update.dto';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { Role } from 'src/enum/roles.enum';

@Controller('booking')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BookingController {
  constructor(private serv: BookingService, private textClient: TextClient) {}

  @Get()
  @Roles(Role.Admin)
  public async getById(@Query() query: { id: string }): Promise<BookingDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('list')
  @Roles(Role.Admin)
  public async getAll(@Query() query: PaginatedDTO): Promise<BookingDTO[]> {
    return await this.serv.getAll(query);
  }

  @Get('total-earnings')
  @Roles(Role.Admin)
  public async getTotalEarnings(@Query() query: PaginatedDTO): Promise<number> {
    return await this.serv.getTotalEarnings(query.start, query.end);
  }

  @Post('create-batch')
  @Roles(Role.Admin)
  public async createBatch(@Body() body: BookingBatchDTO): Promise<BookingDTO> {
    return await this.serv.createBatch(body);
  }

  @Post('confirm')
  @Roles(Role.Admin)
  public async sendBookingConfirmText(
    @Body() body: BookingConfirmTextDTO,
  ): Promise<void> {
    return await this.textClient.sendBookingConfirmedText(body);
  }

  @Post('send-referral-code')
  @Roles(Role.Admin)
  public async sendReferralCode(
    @Body() body: { bookingId: string },
  ): Promise<void> {
    return await this.serv.sendReferralCode(body.bookingId);
  }

  @Put('update')
  @Roles(Role.Admin)
  public async update(@Body() body: BookingUpdateDTO): Promise<BookingDTO> {
    return await this.serv.update(body);
  }

  @Delete('delete')
  @Roles(Role.Admin)
  public async delete(
    @Query() query: { id: string; state: string; eventId: string },
  ): Promise<DeleteResult> {
    return await this.serv.delete(query.id, query.state, query.eventId);
  }
}
