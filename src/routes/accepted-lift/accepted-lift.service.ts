import { AcceptedLiftDTO } from './../../dto/acceptedLift.dto';
import { AcceptedLift } from './../../model/acceptedLift.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AcceptedLiftService {
  constructor(@InjectRepository(AcceptedLift) private readonly repo: Repository<AcceptedLift>) { }

  public async getAll(start: Date, end: Date, order: 'ASC' | 'DESC', page: number, pageSize: number) {
    let query = this.repo.createQueryBuilder('q')
      .leftJoinAndSelect('q.lift', 'lift')
      .leftJoinAndSelect('lift.booking', 'booking')

    // Time Queries
    if (start && end)
      query.where('booking.startTime between :start and :end', { start: start, end: end })
    else if (start)
      query.where('booking.startTime between :start and :end', { start: start, end: new Date() })

    query.orderBy('booking.startTime', order)

    // Pagination
    if (page && pageSize)
      query.skip((page - 1) * pageSize).take(pageSize)

    return await query.getMany().then(lifts => lifts.map(lift => AcceptedLiftDTO.fromEntity(lift)));
  }

  public async getById(id: string) {
    return await
      this.repo.findOne({ id: id }, { relations: ['lifter', 'lift', 'lift.booking'] })
        .then(e => AcceptedLiftDTO.fromEntity(e));
  }
}
