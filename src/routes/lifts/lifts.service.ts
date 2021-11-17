import { TwoWayMap } from './../../helper/twoWayMap.helper';
import { Lifter } from 'src/model/lifters.entity';
import { AcceptedLiftService } from './../accepted-lift/accepted-lift.service';
import { LifterPaginatedDTO } from 'src/dto/lifter.paginated.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { Lift } from './../../model/lifts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LiftDTO } from 'src/dto/lift.dto';

@Injectable()
export class LiftsService {
  private stateMap: TwoWayMap;

  constructor(
    @InjectRepository(Lift) private readonly repo: Repository<Lift>,
    @InjectRepository(Lifter) private readonly lifterRepo: Repository<Lifter>,
    private readonly acceptedLiftServ: AcceptedLiftService,
  ) {
    this.stateMap = new TwoWayMap({
      UTAH: 'UT',
      NEVADA: 'NV',
      TEXAS: 'TX',
      ARIZONA: 'AZ',
    });
  }

  public async getById(id: string): Promise<LiftDTO> {
    return LiftDTO.fromEntity(
      await this.repo.findOne(
        { id: id },
        {
          relations: [
            'booking',
            'booking.startingAddress',
            'booking.endingAddress',
            'acceptedLifts',
          ],
        },
      ),
    );
  }

  public async getAll(request: PaginatedDTO): Promise<LiftDTO[]> {
    const { start, end, page, pageSize, order } = request;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.booking', 'booking')
      .leftJoinAndSelect('booking.startingAddress', 'startingAddress')
      .leftJoinAndSelect('booking.endingAddress', 'endingAddress');

    // Time Queries
    if (start && end)
      query.where('booking.startTime between :start and :end', {
        start: start,
        end: end,
      });
    else if (start)
      query.where('booking.startTime between :start and :end', {
        start: start,
        end: new Date(),
      });

    query.orderBy('booking.startTime', order);

    // Pagination
    if (page && pageSize) query.skip((page - 1) * pageSize).take(pageSize);

    return await query
      .getMany()
      .then((lifts) => lifts.map((lift) => LiftDTO.fromEntity(lift)));
  }

  public async getAllAvailableLifts(request: PaginatedDTO): Promise<LiftDTO[]> {
    const { start, end, page, pageSize, order } = request;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.booking', 'booking')
      .leftJoinAndSelect('booking.startingAddress', 'startingAddress')
      .leftJoinAndSelect('booking.endingAddress', 'endingAddress');

    // Time Queries
    if (start && end)
      query.where('booking.startTime between :start and :end', {
        start: start,
        end: end,
      });
    else if (start)
      query.where('booking.startTime between :start and :end', {
        start: start,
        end: new Date(),
      });

    query.andWhere('q.currentLifterCount != booking.lifterCount');
    query.orderBy('booking.startTime', order);

    // Pagination
    if (page && pageSize) query.skip((page - 1) * pageSize).take(pageSize);

    return await query
      .getMany()
      .then((lifts) => lifts.map((lift) => LiftDTO.fromEntity(lift)));
  }

  public async getLifterAvailable(
    request: LifterPaginatedDTO,
  ): Promise<LiftDTO[]> {
    const { lifterId, start, end, page, pageSize, order } = request;

    const lifterAcceptedLifts = await this.acceptedLiftServ.getLifterAccepted(
      request,
    );

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.booking', 'booking')
      .leftJoinAndSelect('booking.startingAddress', 'startingAddress')
      .leftJoinAndSelect('booking.endingAddress', 'endingAddress');

    // Time Queries
    if (start && end)
      query.where('booking.startTime between :start and :end', {
        start: start,
        end: end,
      });
    else if (start)
      query.where('booking.startTime between :start and :end', {
        start: start,
        end: new Date(),
      });

    query.andWhere('q.currentLifterCount != booking.lifterCount');

    lifterAcceptedLifts.forEach((item) => {
      query.andWhere('booking.startTime not between :start and :end', {
        start: item.lift.booking.startTime,
        end: item.lift.booking.endTime,
      });

      query.andWhere(
        ':start not between booking.startTime and booking.endTime',
        { start: item.lift.booking.startTime },
      );
    });

    const lifterAddress = await this.lifterRepo.findOne(
      { id: lifterId },
      { relations: ['address'] },
    );

    query.andWhere(
      '(UPPER(booking.startingAddress.state) LIKE UPPER(:state) OR UPPER(booking.startingAddress.state) LIKE UPPER(:stateMap))',
      {
        state: lifterAddress.address.state,
        stateMap: this.stateMap.get(lifterAddress.address.state.toUpperCase()),
      },
    );
    query.orderBy('booking.startTime', order);

    // Pagination
    if (page && pageSize) query.skip((page - 1) * pageSize).take(pageSize);

    return await query
      .getMany()
      .then((lifts) => lifts.map((lift) => LiftDTO.fromEntity(lift)));
  }
}
