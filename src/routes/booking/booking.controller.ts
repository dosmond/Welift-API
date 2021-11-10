import { BookingService } from './booking.service';
import { Controller, Get } from '@nestjs/common';

@Controller('booking')
export class BookingController {
  constructor(private serv: BookingService) { }

  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }
}
