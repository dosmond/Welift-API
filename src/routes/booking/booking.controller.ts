import { BookingDTO } from 'src/dto/booking.dto';
import { BookingService } from './booking.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookingBatchDTO } from 'src/dto/booking.batch.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';

@Controller('booking')
export class BookingController {
  constructor(private serv: BookingService) { }

  @Get()
  public async getById(@Query() query: { id: string }): Promise<BookingDTO> {
    return await this.serv.getById(query.id)
  }

  @Get('list')
  public async getAll(@Query() query: PaginatedDTO): Promise<BookingDTO[]> {
    return await this.serv.getAll(query);
  }

  @Post('create-batch')
  public async createBatch(@Body() body: BookingBatchDTO): Promise<BookingDTO> {
    return await this.serv.createBatch(body)
  }
}
