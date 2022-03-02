import { SlackHelper } from '@src/helper/slack.helper';
import { HighRiskBookingDeletionCancellationEvent } from './../../events/highRiskBookingDeletionCancellation.event';
import { ReferrerBonusEvent } from './../../events/referrerBonus.event';
import {
  LifterRankingTruckBasePay,
  LifterRankingBasePay,
} from './../../enum/lifterRanking.enum';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { Lift } from '../../model/lifts.entity';
import { AcceptedLift } from './../../model/acceptedLift.entity';
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotAcceptableException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenVerificationRequestDTO } from '../../dto/tokenVerification.dto';
import { AcceptedLiftDTO } from '../../dto/acceptedLift.dto';
import { User } from '../../user.decorator';
import { DeleteResult, getConnection, getManager, Repository } from 'typeorm';
import { PaginatedDTO } from '../../dto/base.paginated.dto';
import { LifterPaginatedDTO } from '../../dto/lifter.paginated.dto';
import { AcceptedLiftUpdateDTO } from '../../dto/acceptedLift.update.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventNames } from '../../enum/eventNames.enum';
import { ClockOutEvent } from '../../events/clockout.event';
import { LifterTransactionDTO } from '@src/dto/lifterTransaction.dto';
import { Lifter } from '@src/model/lifters.entity';
import { LifterTransactionUpdateDTO } from '@src/dto/lifterTransaction.update.dto';

@Injectable()
export class AcceptedLiftService {
  private readonly logger: Logger = new Logger(AcceptedLiftService.name);

  constructor(
    @InjectRepository(AcceptedLift)
    private readonly repo: Repository<AcceptedLift>,
    @InjectRepository(Lift)
    private readonly liftRepo: Repository<Lift>,
    private readonly transactionService: LifterTransactionsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly slackHelper: SlackHelper,
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
      .findOne(
        { id: id },
        { relations: ['lifter', 'lift', 'lift.booking', 'transaction'] },
      )
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
      .leftJoinAndSelect('q.transaction', 'transaction')
      .leftJoinAndSelect('lift.booking', 'booking')
      .leftJoinAndSelect('booking.startingAddress', 'startingAddress')
      .leftJoinAndSelect('booking.endingAddress', 'endingAddress')
      .leftJoin('q.lifter', 'lifter');

    query.where('q.lifter_id = :id', { id: lifterId });

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

      if (
        liftToUpdate.currentLifterCount === liftToUpdate.booking.lifterCount
      ) {
        this.eventEmitter.emit(
          EventNames.HighRiskBookingDeletionCancellation,
          new HighRiskBookingDeletionCancellationEvent({
            liftId: lift.liftId,
          }),
        );
      }

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

  public async verifyToken(user: User, request: TokenVerificationRequestDTO) {
    const lift = await this.repo.findOne(
      { id: request.acceptedLiftId },
      {
        relations: [
          'lift',
          'lift.booking',
          'lift.booking.startingAddress',
          'lifter',
        ],
      },
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

    // Add transaction if role includes 'tester'
    // 'tester' check to be removed on official release of payouts
    if (user.roles.includes('tester') || user.roles.includes('admin')) {
      try {
        const transaction = await this.transactionService.create(
          user,
          new LifterTransactionDTO({
            lifterId: lift.lifterId,
            title: `Lift in ${lift?.lift?.booking?.startingAddress?.city}`,
            amount: lift.totalPay * 100,
          }),
        );

        lift.transactionId = transaction.id;
      } catch (err) {
        throw new BadRequestException(err);
      }

      await this.checkForReferralBonus(user, lift.lifter);
    }

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

      if (!(await this.repo.findOne({ id: dto.id })))
        throw new BadRequestException('Accepted Lift does not exist');

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
      .leftJoinAndSelect('q.lifter', 'lifter')
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

  public async updateClockTimes(
    acceptedLift: AcceptedLiftDTO,
  ): Promise<AcceptedLiftUpdateDTO> {
    const dto = AcceptedLiftDTO.from(acceptedLift);

    const lift = await this.repo.findOne(
      { id: dto.id },
      {
        relations: [
          'lifter',
          'lift',
          'lift.booking',
          'lift.booking.startingAddress',
        ],
      },
    );

    if (!lift) {
      throw new BadRequestException('Accepted Lift does not exist');
    }

    dto.lifter = lift.lifter;
    dto.transactionId = lift.transactionId;

    [dto.payrate, dto.totalPay] = this.getPayrateAndTotalPay(dto);

    if (dto.transactionId) {
      await this.transactionService.updateAmount(
        new LifterTransactionUpdateDTO({
          id: dto.transactionId,
          amount: dto.totalPay * 100,
        }),
      );
    } else if (dto.clockOutTime && lift.lifter.plaidInfo.isBetaTester) {
      const transaction = await this.transactionService.create(
        null,
        new LifterTransactionUpdateDTO({
          lifterId: lift.lifterId,
          title: `Lift in ${lift?.lift?.booking?.startingAddress?.city}`,
          amount: dto.totalPay * 100,
        }),
      );

      dto.transactionId = transaction.id;
    }

    return AcceptedLiftUpdateDTO.fromEntity(
      await this.repo.save(dto.toEntity()),
    );

    return;
  }

  public async delete(user: User, id: string): Promise<DeleteResult> {
    try {
      return await getManager().transaction('SERIALIZABLE', async (manager) => {
        const accepted = await manager.findOne(AcceptedLift, id, {
          relations: ['lift', 'lifter', 'lift.booking'],
        });

        const liftToUpdate = await this.liftRepo.findOne(
          { id: accepted?.lift?.id },
          { relations: ['booking', 'acceptedLifts'] },
        );

        if (liftToUpdate?.currentLifterCount - 1 < 0) {
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
        await this.slackHelper.sendBasicSucessSlackMessage(
          this.slackHelper.prepareBasicSuccessSlackMessage({
            type: SlackHelper.ACCEPTED_LIFT_DELETED,
            objects: [accepted],
            sendBasic: true,
          }),
        );

        return await manager.delete(AcceptedLift, id);
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async deleteAllByLifterId(lifterId: string): Promise<void> {
    const lifts = await this.repo.find({ lifterId: lifterId });
    const promises: Promise<DeleteResult>[] = [];
    lifts.forEach((lift) => {
      promises.push(this.delete(null, lift.id));
    });

    await Promise.all(promises);
  }

  private async checkForReferralBonus(user: User, lifter: Lifter) {
    if (
      lifter.referredCode &&
      (
        await this.getLifterAccepted(
          new LifterPaginatedDTO({
            lifterId: lifter.id,
            hideUncompleted: true,
          }),
        )
      ).length === 0
    ) {
      await this.transactionService.create(
        user,
        new LifterTransactionDTO({
          lifterId: lifter.id,
          title: `Referred Bonus`,
          amount: 2000,
          isReferral: true,
        }),
      );

      this.eventEmitter.emit(
        EventNames.ReferrerBonus,
        new ReferrerBonusEvent({
          referredCode: lifter.referredCode,
          referredName: lifter.firstName,
        }),
      );
    }
  }

  @OnEvent(EventNames.AutoClockOut)
  private async handleAutoClockOut(payload: ClockOutEvent) {
    try {
      const lift = await this.liftRepo.findOne(
        { id: payload.liftId },
        {
          relations: [
            'acceptedLifts',
            'acceptedLifts.lifter',
            'booking',
            'booking.startingAddress',
          ],
        },
      );

      for (const accepted of lift?.acceptedLifts) {
        if (accepted.clockInTime && !accepted.clockOutTime) {
          accepted.clockOutTime = new Date(Date.now());
          [accepted.payrate, accepted.totalPay] =
            this.getPayrateAndTotalPay(accepted);

          try {
            if (accepted?.lifter?.plaidInfo?.isBetaTester) {
              await this.transactionService.create(
                null,
                new LifterTransactionDTO({
                  lifterId: accepted.lifterId,
                  title: `Lift in ${lift?.booking?.startingAddress?.city}`,
                  amount: accepted.totalPay * 100,
                }),
              );

              await this.checkForReferralBonus(null, accepted.lifter);
            }
          } catch (err) {
            this.logger.error(err);
            return;
          }

          await this.update(null, AcceptedLiftUpdateDTO.fromEntity(accepted));
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  private getPayrateAndTotalPay(lift: AcceptedLift): number[] {
    const startTime = new Date(lift.clockInTime);
    const endTime = new Date(lift.clockOutTime);

    // Diff / 1000 = Total seconds
    // Total seconds / 3600 = Total Hours
    const diff = (endTime.getTime() - startTime.getTime()) / 1000 / 3600;
    const totalTime = Math.abs(diff);

    // Change payrate if you have a truck
    const payrate = lift.usePickupTruck
      ? LifterRankingTruckBasePay[lift.lifter.ranking]
      : LifterRankingBasePay[lift.lifter.ranking];

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
