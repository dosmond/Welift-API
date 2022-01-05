import { Lift } from 'src/model/lifts.entity';
import { AcceptedLift } from './../../model/acceptedLift.entity';
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotAcceptableException,
} from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenVerificationRequestDTO } from 'src/dto/tokenVerification.dto';
import { AcceptedLiftDTO } from '../../dto/acceptedLift.dto';
import { User } from 'src/user.decorator';
import { DeleteResult, getConnection, getManager } from 'typeorm';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LifterPaginatedDTO } from 'src/dto/lifter.paginated.dto';
import { AcceptedLiftUpdateDTO } from 'src/dto/acceptedLift.update.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from 'src/enum/eventNames.enum';
import { ClockOutEvent } from 'src/events/clockout.event';

@Injectable()
export class AcceptedLiftService {
  constructor(
    @InjectRepository(AcceptedLift)
    private readonly repo: Repository<AcceptedLift>,
    @InjectRepository(Lift)
    private readonly liftRepo: Repository<Lift>,
  ) {}

  public async getAll(details: PaginatedDTO) {
    const { start, end, order, page, pageSize } = details;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.lift', 'lift')
      .leftJoinAndSelect('lift.booking', 'booking');

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
      .then((lifts) => lifts.map((lift) => AcceptedLiftDTO.fromEntity(lift)));
  }

  public async getById(id: string): Promise<AcceptedLiftDTO> {
    return await this.repo
      .findOne({ id: id }, { relations: ['lifter', 'lift', 'lift.booking'] })
      .then((e) => AcceptedLiftDTO.fromEntity(e));
  }

  public async getLifterAccepted(
    details: LifterPaginatedDTO,
  ): Promise<AcceptedLiftDTO[]> {
    const {
      lifterId,
      start,
      end,
      order,
      page,
      pageSize,
      hideCompleted,
      hideUncompleted,
    } = details;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.lift', 'lift')
      .leftJoinAndSelect('lift.booking', 'booking')
      .leftJoinAndSelect('booking.startingAddress', 'startingAddress')
      .leftJoinAndSelect('booking.endingAddress', 'endingAddress')
      .leftJoin('q.lifter', 'lifter');

    query.where('lifter_id = :id', { id: lifterId });

    if (hideCompleted && !hideUncompleted) {
      query.andWhere('q.clockOutTime is null');
    }

    if (hideUncompleted && !hideCompleted) {
      query.andWhere('q.clockOutTime is not null');
    }

    if (start && end)
      // Time Queries
      query.andWhere('booking.startTime between :start and :end', {
        start: start,
        end: end,
      });
    else if (start)
      query.andWhere('booking.startTime between :start and :end', {
        start: start,
        end: new Date(),
      });

    query.orderBy('booking.startTime', order);

    // Pagination
    if (page && pageSize) query.skip((page - 1) * pageSize).take(pageSize);

    return await query
      .getMany()
      .then((lifts) => lifts.map((lift) => AcceptedLiftDTO.fromEntity(lift)));
  }

  public async getLifterAcceptedSum(
    details: LifterPaginatedDTO,
  ): Promise<number> {
    const { lifterId, start, end, hideCompleted, hideUncompleted } = details;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.lift', 'lift')
      .leftJoinAndSelect('lift.booking', 'booking')
      .leftJoinAndSelect('booking.startingAddress', 'startingAddress')
      .leftJoinAndSelect('booking.endingAddress', 'endingAddress')
      .leftJoin('q.lifter', 'lifter');

    query.where('lifter_id = :id', { id: lifterId });

    if (hideCompleted && !hideUncompleted) {
      query.andWhere('q.clockOutTime is null');
    }

    if (hideUncompleted && !hideCompleted) {
      query.andWhere('q.clockOutTime is not null');
    }

    if (start && end)
      // Time Queries
      query.andWhere('booking.startTime between :start and :end', {
        start: start,
        end: end,
      });
    else if (start)
      query.andWhere('booking.startTime between :start and :end', {
        start: start,
        end: new Date(),
      });

    const prePagininationResults = await query.getMany();

    const sum = prePagininationResults.reduce(
      (acc, curr) => acc + curr.totalPay,
      0,
    );

    return sum;
  }

  public async create(
    user: User,
    lift: AcceptedLiftDTO,
  ): Promise<AcceptedLiftDTO> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const liftToUpdate = await this.liftRepo.findOne(
        { id: lift.liftId },
        { relations: ['booking'] },
      );

      if (
        liftToUpdate.currentLifterCount + 1 >
        liftToUpdate.booking.lifterCount
      ) {
        throw new BadRequestException('Cannot exceed maximum lifter count');
      }

      liftToUpdate.currentLifterCount += 1;

      // If this is the last slot and the booking still needs
      // someone with a pickup truck, then only allow people with a pickup truck.
      if (
        liftToUpdate.booking.needsPickupTruck &&
        liftToUpdate.currentLifterCount == liftToUpdate.booking.lifterCount &&
        !liftToUpdate.hasPickupTruck &&
        !lift.usePickupTruck
      ) {
        throw new BadRequestException(
          'This lift requires someone with a pickup truck',
        );
      }

      // Update lift if lifter is using pickup truck.
      if (lift.usePickupTruck) {
        liftToUpdate.hasPickupTruck = true;
      }

      await queryRunner.manager.save(liftToUpdate);

      const dto = AcceptedLiftDTO.fromEntity(lift);
      const result = await queryRunner.manager.save(dto.toEntity(user));
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return AcceptedLiftDTO.fromEntity(result);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err.message);
    }
  }

  public async verifyToken(request: TokenVerificationRequestDTO) {
    const lift = await this.repo.findOne(
      { id: request.acceptedLiftId },
      { relations: ['lift'] },
    );

    if (!lift) {
      throw new BadRequestException('Lift does not exist');
    }

    if (!lift.clockInTime) {
      throw new BadRequestException('Must be clocked in first!');
    }

    if (lift.clockOutTime) {
      throw new ConflictException('Already Clocked Out');
    }

    if (lift.lift.completionToken !== request.token) {
      throw new NotAcceptableException('Token not verified');
    }

    lift.clockOutTime = new Date();

    [lift.payrate, lift.totalPay] = this.getPayrateAndTotalPay(lift);

    try {
      const updatedLift = await this.repo.save(lift);
      return AcceptedLiftDTO.fromEntity(updatedLift);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async update(
    user: User,
    acceptedLift: AcceptedLiftUpdateDTO,
  ): Promise<AcceptedLiftUpdateDTO> {
    try {
      const dto = AcceptedLiftUpdateDTO.fromEntity(acceptedLift);
      return AcceptedLiftUpdateDTO.fromEntity(
        await this.repo.save(dto.toEntity()),
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // This will be used to update all
  // previously completed lifts totalPay column.
  public async updateAllLiftTotalPay(): Promise<void> {
    const lifts = await this.repo
      .createQueryBuilder('q')
      .where('q.clockOutTime is not null')
      .getMany();

    const updates: Promise<AcceptedLift>[] = [];

    for (let i = 0; i < lifts.length; i++) {
      [lifts[i].payrate, lifts[i].totalPay] = this.getPayrateAndTotalPay(
        lifts[i],
      );

      updates.push(this.repo.save(lifts[i]));
    }

    await Promise.all(updates);
  }

  public async delete(user: User, id: string): Promise<DeleteResult> {
    try {
      return await getManager().transaction('SERIALIZABLE', async (manager) => {
        const accepted = await manager.findOne(AcceptedLift, id, {
          relations: ['lift'],
        });

        const liftToUpdate = await this.liftRepo.findOne(
          { id: accepted.lift.id },
          { relations: ['booking', 'acceptedLifts'] },
        );

        if (liftToUpdate.currentLifterCount - 1 < 0) {
          throw new BadRequestException('Cannot have less than 0 lifters');
        }

        liftToUpdate.currentLifterCount -= 1;

        // Determine if we need to change the hasPickupTruck flag
        if (
          liftToUpdate?.booking?.needsPickupTruck &&
          accepted?.usePickupTruck
        ) {
          let nowNeedsTruck = true;
          liftToUpdate.acceptedLifts.forEach((lift) => {
            if (lift.id !== accepted.id && lift.usePickupTruck)
              nowNeedsTruck = false;
          });

          if (nowNeedsTruck) {
            liftToUpdate.hasPickupTruck = false;
          }
        }

        await manager.save(liftToUpdate);
        return await manager.delete(AcceptedLift, id);
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async deleteAllByLifterId(lifterId: string) {
    const request = new LifterPaginatedDTO();
    request.lifterId = lifterId;
    const acceptedLifts = await this.getLifterAccepted(request);

    const promises: Promise<DeleteResult>[] = [];
    acceptedLifts.forEach((acceptedLift) => {
      promises.push(this.delete(null, acceptedLift.id));
    });
    await Promise.all(promises);
  }

  @OnEvent(EventNames.AutoClockOut)
  private async handleAutoClockOut(payload: ClockOutEvent) {
    const lift = await this.liftRepo.findOne({ id: payload.liftId });

    const promises: Promise<AcceptedLiftUpdateDTO>[] = [];
    lift.acceptedLifts.forEach((accepted) => {
      if (!accepted.clockOutTime) {
        accepted.clockOutTime = new Date(Date.now());
        [accepted.payrate, accepted.totalPay] =
          this.getPayrateAndTotalPay(accepted);
        promises.push(
          this.update(null, AcceptedLiftUpdateDTO.fromEntity(accepted)),
        );
      }
    });
    await Promise.all(promises);
  }

  private getPayrateAndTotalPay(lift: AcceptedLift): number[] {
    const startTime = new Date(lift.clockInTime);
    const endTime = new Date(lift.clockOutTime);

    // Diff / 1000 = Total seconds
    // Total seconds / 3600 = Total Hours
    const diff = (endTime.getTime() - startTime.getTime()) / 1000 / 3600;
    const totalTime = Math.abs(diff);

    // Change payrate if you have a truck
    const payrate = lift.usePickupTruck ? 35.0 : 20.0;

    // Anything in first hour is guaranteed the payrate
    if (totalTime <= 1) {
      return [payrate, payrate];
    }

    // Calculate the completed hours
    // and get the remainder
    const fullHours = Math.floor(totalTime);

    const partHours = totalTime % 1;

    // Prorate every 15 minutes. Round up
    if (partHours > 0.75) {
      return [payrate, (fullHours + 1) * payrate];
    }

    if (partHours > 0.5) {
      return [payrate, fullHours * payrate + 0.75 * payrate];
    }

    if (partHours > 0.25) {
      return [payrate, fullHours * payrate + 0.5 * payrate];
    }

    return [payrate, fullHours * payrate + 0.25 * payrate];
  }
}
