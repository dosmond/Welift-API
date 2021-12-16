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
    const { lifterId, start, end, order, page, pageSize, hideCompleted } =
      details;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.lift', 'lift')
      .leftJoinAndSelect('lift.booking', 'booking')
      .leftJoinAndSelect('booking.startingAddress', 'startingAddress')
      .leftJoinAndSelect('booking.endingAddress', 'endingAddress')
      .leftJoin('q.lifter', 'lifter');

    query.where('lifter_id = :id', { id: lifterId });

    if (hideCompleted) {
      query.andWhere('q.clockOutTime is null');
    }

    // Time Queries
    if (start && end)
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

    lift.payrate = this.getPayrate(lift);

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

  public async delete(user: User, id: string): Promise<DeleteResult> {
    try {
      return await getManager().transaction('SERIALIZABLE', async (manager) => {
        const accepted = await manager.findOne(AcceptedLift, id, {
          relations: ['lift'],
        });

        const liftToUpdate = await this.liftRepo.findOne(
          { id: accepted.lift.id },
          { relations: ['booking'] },
        );

        if (liftToUpdate.currentLifterCount - 1 < 0) {
          throw new BadRequestException('Cannot have less than 0 lifters');
        }

        liftToUpdate.currentLifterCount -= 1;

        await manager.save(liftToUpdate);
        return await manager.delete(AcceptedLift, id);
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  private getPayrate(lift: AcceptedLift): number {
    const startTime = new Date(lift.clockInTime);
    const endTime = new Date(lift.clockOutTime);

    let diff = (endTime.getTime() - startTime.getTime()) / 1000;
    diff /= 60 * 60;
    const totalTime = Math.abs(Math.ceil(diff));

    if (totalTime <= 1) return 20.0;

    return 25.0;
  }
}
