import { Booking } from './../../model/booking.entity';
import { Lift } from './../../model/lifts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class LiftsService {
  constructor(@InjectRepository(Lift) private readonly repo: Repository<Lift>) { }

  public async getAll() {
    return await this.repo.find({ relations: ['booking', 'booking.startingAddress', 'booking.endingAddress'] });
  }
}
