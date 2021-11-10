import { AcceptedLift } from './../../model/acceptedLift.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';
import { orderBy } from 'lodash'

@Injectable()
export class AcceptedLiftService {
  constructor(@InjectRepository(AcceptedLift) private readonly repo: Repository<AcceptedLift>) { }

  public async getAll(start: Date, end: Date, order: string) {
    let whereClause = {}

    if (start && end) {
      whereClause = {
        lift: {
          booking: {
            startTime: Between(start, end)
          }
        }
      }
    }
    else if (start) {
      whereClause = {
        lift: {
          booking: {
            startTime: Between(start, new Date())
          }
        }
      }
    }

    let orderDirection = ['asc']
    if (order.toUpperCase() === 'DESC')
      orderDirection = ['desc']

    let value = await this.repo.find({
      relations: ['lifter', 'lift', 'lift.booking'],
      where: whereClause,
      take: 100,
    });
    return orderBy(value, (accepted: AcceptedLift) => accepted.lift.booking.startTime, orderDirection)
  }

  public async getById(id: string) {
    return await this.repo.findOne({ id: id }, { relations: ['lifter', 'lift', 'lift.booking'] });
  }
}
