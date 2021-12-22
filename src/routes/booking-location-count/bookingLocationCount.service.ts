import { BookingLocationCount } from '../../model/bookingLocationCount.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookingLocationCountService {
  constructor(
    @InjectRepository(BookingLocationCount)
    private readonly repo: Repository<BookingLocationCount>,
  ) {}
}
