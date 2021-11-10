import { AcceptedLift } from './../../model/acceptedLift.entity';
import { Injectable, BadRequestException, ConflictException, NotAcceptableException } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenVerificationRequestDTO } from 'src/dto/tokenVerification.dto';
import { AcceptedLiftDTO } from './../../dto/acceptedLift.dto';

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

  public async verifyToken(request: TokenVerificationRequestDTO) {
    let lift = await this.repo.findOne({ id: request.acceptedLiftId }, { relations: ['lift'] })

    if (!lift) {
      throw new BadRequestException('Lift does not exist')
    }

    if (!lift.clockInTime) {
      throw new BadRequestException('Must be clocked in first!')
    }

    if (lift.clockOutTime) {
      throw new ConflictException('Already Clocked Out')
    }

    if (lift.lift.completionToken !== request.token) {
      throw new NotAcceptableException('Token not verified')
    }

    lift.clockOutTime = new Date()

    lift.payrate = this.getPayrate(lift)

    let updatedLift = await this.repo.save(lift)

    return AcceptedLiftDTO.fromEntity(updatedLift)
  }

  private getPayrate(lift: AcceptedLift): number {
    let startTime = new Date(lift.clockInTime)
    let endTime = new Date(lift.clockOutTime)

    var diff = (endTime.getTime() - startTime.getTime()) / 1000
    diff /= (60 * 60)
    let totalTime = Math.abs(Math.ceil(diff))

    if (totalTime <= 1)
      return 20.00

    return 25.00
  }
}
