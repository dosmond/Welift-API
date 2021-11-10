import { Booking } from './../../model/booking.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(@InjectRepository(Booking) private readonly repo: Repository<Booking>) { }

  public async getAll() {
    return await this.repo.find();
  }
}
