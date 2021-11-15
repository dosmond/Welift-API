import { BookingDTO } from './../../dto/booking.dto';
import { BookingService } from './booking.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookingBatchDTO } from 'src/dto/booking.batch.dto';

@Controller('booking')
export class BookingController {
  constructor(private serv: BookingService) { }

  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }

  @Post('create-batch')
  public async createBatch(@Body() body: BookingBatchDTO): Promise<BookingDTO> {
    return await this.serv.createBatch(body)
  }
}
