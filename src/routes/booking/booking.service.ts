import { Booking } from './../../model/booking.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingDTO } from 'src/dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(@InjectRepository(Booking) private readonly repo: Repository<Booking>) { }

  public async getAll(): Promise<BookingDTO[]> {
    return [new BookingDTO()]
  }

  public async
}
