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

  public async getByState(state: string): Promise<BookingLocationCount> {
    return await this.repo.findOne({ state: state });
  }

  public async getAll(): Promise<BookingLocationCount[]> {
    return await this.repo.find();
  }

  public async upsert(
    request: BookingLocationCount,
  ): Promise<BookingLocationCount> {
    return await this.repo.save(request);
  }
}
