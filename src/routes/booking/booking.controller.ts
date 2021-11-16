import { TextClient } from '../../helper/text.client';
import { BookingDTO } from 'src/dto/booking.dto';
import { BookingService } from './booking.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookingBatchDTO } from 'src/dto/booking.batch.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { BookingConfirmTextDTO } from 'src/dto/bookingConfirmText.dto';

@Controller('booking')
export class BookingController {
  constructor(private serv: BookingService, private textClient: TextClient) {}

  @Get()
  public async getById(@Query() query: { id: string }): Promise<BookingDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('list')
  public async getAll(@Query() query: PaginatedDTO): Promise<BookingDTO[]> {
    return await this.serv.getAll(query);
  }

  @Get('total-earnings')
  public async getTotalEarnings(@Query() query: PaginatedDTO): Promise<number> {
    return await this.serv.getTotalEarnings(query.start, query.end);
  }

  @Post('create-batch')
  public async createBatch(@Body() body: BookingBatchDTO): Promise<BookingDTO> {
    return await this.serv.createBatch(body);
  }

  @Post('confirm')
  public async sendBookingConfirmText(
    @Body() body: BookingConfirmTextDTO,
  ): Promise<void> {
    return await this.textClient.sendBookingConfirmedText(body);
  }

  @Post('send-referral-code')
  public async sendReferralCode(
    @Body() body: { bookingId: string },
  ): Promise<void> {
    return await this.serv.sendReferralCode(body.bookingId);
  }
}
