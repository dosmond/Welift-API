import { TextClient } from './../../helper/text.client';
import { AcceptedLiftDTO } from 'src/dto/acceptedLift.dto';
import { TwoWayMap } from './../../helper/twoWayMap.helper';
import { Lifter } from 'src/model/lifters.entity';
import { AcceptedLiftService } from './../accepted-lift/accepted-lift.service';
import { LifterPaginatedDTO } from 'src/dto/lifter.paginated.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { Lift } from './../../model/lifts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  DeleteResult,
  Repository,
  Transaction,
  TransactionRepository,
} from 'typeorm';
import { LiftDTO } from 'src/dto/lift.dto';
import { LiftUpdateDTO } from 'src/dto/lift.update.dto';

@Injectable()
export class LiftsService {
  private stateMap: TwoWayMap;

  constructor(
    @InjectRepository(Lift) private readonly repo: Repository<Lift>,
    @InjectRepository(Lifter) private readonly lifterRepo: Repository<Lifter>,
    private readonly acceptedLiftServ: AcceptedLiftService,
    private readonly textClient: TextClient,
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
            'acceptedLifts.lifter',
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
      '(UPPER(startingAddress.state) LIKE UPPER(:state) OR UPPER(startingAddress.state) LIKE UPPER(:stateMap))',
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

  public async currentLifts(request: { lifterId: string }): Promise<LiftDTO[]> {
    const { lifterId } = request;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.acceptedLifts', 'acceptedLifts')
      .leftJoinAndSelect('acceptedLifts.lifter', 'lifter')
      .leftJoinAndSelect('q.booking', 'booking')
      .leftJoinAndSelect('booking.startingAddress', 'startingAddress')
      .leftJoinAndSelect('booking.endingAddress', 'endingAddress');

    if (lifterId) {
      query.where('lifter.id = :id', { id: lifterId });

      query.andWhere(
        ':now between booking.startTime - INTERVAL "15 min" and booking.endTime',
        {
          now: new Date().toISOString(),
        },
      );

      query.andWhere('acceptedLifts.clockOutTime IS NULL');
    } else {
      query.where(
        ':now between booking.startTime - INTERVAL "15 min" and booking.endTime',
        {
          now: new Date().toISOString(),
        },
      );
    }

    return await query
      .getMany()
      .then((lifts) => lifts.map((lift) => LiftDTO.fromEntity(lift)));
  }

  public async getLiftersByLift(liftId: string): Promise<AcceptedLiftDTO[]> {
    return this.repo
      .findOne(
        { id: liftId },
        { relations: ['acceptedLifts', 'acceptedLifts.lifter'] },
      )
      .then((lift) =>
        lift.acceptedLifts.map((accepted) =>
          AcceptedLiftDTO.fromEntity(accepted),
        ),
      );
  }

  public async create(lift: LiftDTO): Promise<LiftDTO> {
    const dto = LiftDTO.from(lift);
    return LiftDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  @Transaction({ isolation: 'SERIALIZABLE' })
  public async incrementLifterCount(
    liftId: string,
    @TransactionRepository(Lift) liftRepo: Repository<Lift>,
  ): Promise<void> {
    const lift = await liftRepo.findOne(
      { id: liftId },
      { relations: ['booking'] },
    );

    if (lift.currentLifterCount + 1 > lift.booking.lifterCount)
      throw new BadRequestException('Already at maximum lifter count');

    lift.currentLifterCount += 1;

    try {
      await liftRepo.save(lift);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Transaction({ isolation: 'SERIALIZABLE' })
  public async decrementLifterCount(
    liftId: string,
    @TransactionRepository(Lift) liftRepo: Repository<Lift>,
  ): Promise<void> {
    const lift = await liftRepo.findOne(
      { id: liftId },
      { relations: ['booking'] },
    );

    if (lift.currentLifterCount - 1 < 0)
      throw new BadRequestException(
        'Error decrementing lifter count. Cannot have negative lifters',
      );

    lift.currentLifterCount -= 1;

    try {
      await liftRepo.save(lift);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async sendCompletionToken(liftId: string): Promise<void> {
    const lift = await this.repo.findOne(
      { id: liftId },
      { relations: ['booking'] },
    );

    await this.textClient.sendCustomerCompletionCodeText(
      {
        number: lift.booking.phone,
        customer_name: lift.booking.name,
      },
      lift.completionToken,
    );
  }

  public async update(lift: LiftUpdateDTO): Promise<LiftDTO> {
    const dto = LiftUpdateDTO.from(lift);
    return LiftDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }
}
