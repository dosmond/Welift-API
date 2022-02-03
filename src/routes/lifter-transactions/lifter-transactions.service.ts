import { Lifter } from '@src/model/lifters.entity';
import { Role } from '@src/enum/roles.enum';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { LifterTransaction } from '../../model/lifterTransaction.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LifterTransactionDTO } from '@src/dto/lifterTransaction.dto';
import { LifterTransactionUpdateDTO } from '@src/dto/lifterTransaction.update.dto';
import { Repository } from 'typeorm';
import { LifterPaginatedDTO } from '@src/dto/lifter.paginated.dto';
import { User } from '@src/user.decorator';

@Injectable()
export class LifterTransactionsService {
  constructor(
    @InjectRepository(LifterTransaction)
    private readonly repo: Repository<LifterTransaction>,
    @InjectRepository(Lifter)
    private readonly lifterRepo: Repository<Lifter>,
  ) {}

  public async getById(id: string): Promise<LifterTransactionDTO> {
    return LifterTransactionDTO.fromEntity(
      await this.repo.findOne({ id: id }, { relations: ['lifter'] }),
    );
  }

  public async getLifterCurrentBalance(lifterId: string): Promise<number> {
    const lastTransaction = (
      await this.repo.find({
        where: {
          lifterId: lifterId,
        },
        order: {
          date: 'DESC',
        },
        take: 1,
      })
    )[0];

    return lastTransaction?.remainingBalance;
  }

  public async getAll(request: PaginatedDTO): Promise<LifterTransactionDTO[]> {
    const { start, end, page, pageSize, order } = request;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.lifter', 'lifter');

    // Time Queries
    if (start && end)
      query.where('q.date between :queryStart and :queryEnd', {
        queryStart: start,
        queryEnd: end,
      });
    else if (start)
      query.where('q.date >= :queryStart', {
        queryStart: start,
      });

    query.orderBy('q.date', order);

    // Pagination
    if (page && pageSize) query.skip((page - 1) * pageSize).take(pageSize);

    return await query
      .getMany()
      .then((transactions) =>
        transactions.map((transaction) =>
          LifterTransactionDTO.fromEntity(transaction),
        ),
      );
  }

  public async getAllByLifter(
    request: LifterPaginatedDTO,
  ): Promise<LifterTransactionDTO[]> {
    const { lifterId, start, end, page, pageSize, order } = request;

    const query = this.repo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.lifter', 'lifter');

    // Time Queries
    if (start && end)
      query.where('q.date between :queryStart and :queryEnd', {
        queryStart: start,
        queryEnd: end,
      });
    else if (start)
      query.where('q.date >= :queryStart', {
        queryStart: start,
      });

    query.andWhere('q.lifterId = :lifterId', {
      lifterId: lifterId,
    });

    query.orderBy('q.date', order);

    // Pagination
    if (page && pageSize) query.skip((page - 1) * pageSize).take(pageSize);

    return await query
      .getMany()
      .then((transactions) =>
        transactions.map((transaction) =>
          LifterTransactionDTO.fromEntity(transaction),
        ),
      );
  }

  public async createQuickDeposit(
    user: User,
    request: LifterTransactionDTO,
  ): Promise<LifterTransactionDTO> {
    const dto = LifterTransactionDTO.from(request);

    // Can only alter your own info unless you are an admin
    if (!user.roles.split(',').includes(Role.Admin)) {
      const lifter = await this.lifterRepo.findOne({ id: request.lifterId });

      if (user.sub !== lifter.userId) {
        throw new ForbiddenException('Forbidden');
      }
    }

    if (!dto.isQuickDeposit)
      // Preliminary checks
      // Need to check this for permission purposes.
      throw new BadRequestException('Must be a quick deposit');

    // Only difference is the quick deposit check.
    return await this.createStandardDeposit(dto);
  }

  public async createStandardDeposit(
    request: LifterTransactionDTO,
  ): Promise<LifterTransactionDTO> {
    const dto = LifterTransactionDTO.from(request);

    if (dto.amount >= 0) {
      throw new BadRequestException('Amount must be negative.');
    }

    const currentBalance = await this.getLifterCurrentBalance(dto.lifterId);

    // No transactions so current balance is 0.
    if (!currentBalance)
      throw new BadRequestException(
        'Balance is currently 0. Unable to deposit',
      );

    // Cannot deposit more than the remaining balance.
    if (currentBalance - Math.abs(dto.amount) < 0) {
      throw new BadRequestException('Remaining Balance is insufficient');
    }

    // Calculate remaining balance before saving.
    dto.remainingBalance = currentBalance - Math.abs(dto.amount);

    return LifterTransactionDTO.fromEntity(
      await this.repo.save(dto.toEntity()),
    );
  }

  public async create(
    user: User,
    request: LifterTransactionDTO,
  ): Promise<LifterTransactionDTO> {
    const dto = LifterTransactionDTO.from(request);

    if (dto.isQuickDeposit) return await this.createQuickDeposit(user, request);

    if (dto.amount < 0) return await this.createStandardDeposit(request);

    const currentBalance = await this.getLifterCurrentBalance(dto.lifterId);

    if (!currentBalance) dto.remainingBalance = dto.amount;
    else dto.remainingBalance = currentBalance + dto.amount;

    return LifterTransactionDTO.fromEntity(
      await this.repo.save(dto.toEntity()),
    );
  }

  public async update(
    request: LifterTransactionUpdateDTO,
  ): Promise<LifterTransactionUpdateDTO> {
    const dto = LifterTransactionUpdateDTO.from(request);

    if (!(await this.repo.findOne({ id: dto.id })))
      throw new BadRequestException('Transaction does not exist');

    return LifterTransactionUpdateDTO.fromEntity(
      await this.repo.save(dto.toEntity()),
    );
  }

  /**
   * Note: This should only be called on lifter deletion!
   * NOWHERE ELSE!
   * @param lifterId ID of the lifter being deleted.
   */
  public async deleteByLifter(lifterId: string): Promise<void> {
    await this.repo.delete({ lifterId: lifterId });
  }
}
