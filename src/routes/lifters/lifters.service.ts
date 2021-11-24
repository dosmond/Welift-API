import { LifterStats } from './../../model/lifterStats.entity';
import { LifterUpdateBatchDTO } from './../../dto/lifter.update.batch.dto';
import { Address } from 'src/model/addresses.entity';
import { AddressDTO } from 'src/dto/address.dto';
import { LifterBatchDTO } from './../../dto/lifter.batch.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LifterDTO } from './../../dto/lifter.dto';
import { Lifter } from 'src/model/lifters.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, Between } from 'typeorm';
import { User } from 'src/user.decorator';
import { LifterUpdateDTO } from 'src/dto/lifter.update.dto';
import { AddressUpdateDTO } from 'src/dto/address.update.dto';

@Injectable()
export class LiftersService {
  constructor(
    @InjectRepository(Lifter) private readonly repo: Repository<Lifter>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(LifterStats)
    private readonly statsRepo: Repository<LifterStats>,
  ) {}

  public async getById(user: User, id: string): Promise<LifterDTO> {
    return LifterDTO.fromEntity(
      await this.repo.findOne(
        { id: id },
        {
          relations: [
            'lifterReviews',
            'lifterStats',
            'address',
            'lifterEquipments',
            'completedLifterBadges',
            'lifterCompletedTrainingVideos',
          ],
        },
      ),
    );
  }

  public async getByUserId(user: User, userId: string): Promise<LifterDTO> {
    return LifterDTO.fromEntity(
      await this.repo.findOne(
        { userId: userId },
        {
          relations: [
            'lifterReviews',
            'lifterStats',
            'address',
            'lifterEquipments',
            'completedLifterBadges',
            'lifterCompletedTrainingVideos',
          ],
        },
      ),
    );
  }

  public async getAll(request: PaginatedDTO): Promise<LifterDTO[]> {
    const { start, end, page, pageSize, order } = request;

    const options: FindManyOptions = {
      relations: [],
    };

    if (start && end) {
      options.where = { creationDate: Between(start, end) };
    }
    if (start) {
      options.where = { creationDate: Between(start, new Date()) };
    }

    options.order = { creationDate: order };

    // Pagination
    if (page && pageSize) {
      options.skip = (page - 1) * pageSize;
      options.take = pageSize;
    }

    return await this.repo
      .find(options)
      .then((items) => items.map((item) => LifterDTO.fromEntity(item)));
  }

  public async count(): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, count] = await this.repo.findAndCount();
    return count;
  }

  public async createBatch(batch: LifterBatchDTO): Promise<LifterDTO> {
    const lifter = LifterDTO.from(batch.lifter);
    const address = AddressDTO.from(batch.address);

    // Create Address
    const addressResult = await this.addressRepo.save(address.toEntity());
    lifter.addressId = addressResult.id;

    // Create Lifter
    const result = LifterDTO.fromEntity(
      await this.repo.save(lifter.toEntity()),
    );

    // Create Lifter Stats row
    const lifterStats = new LifterStats();
    lifterStats.lifterId = result.id;
    await this.statsRepo.save(lifterStats);
    return result;
  }

  public async updateBatch(batch: LifterUpdateBatchDTO): Promise<LifterDTO> {
    const lifter = LifterUpdateDTO.from(batch.lifter);
    const address = AddressUpdateDTO.from(batch.address);

    if (batch.address) {
      const addressResult = await this.addressRepo.save(address.toEntity());
      lifter.addressId = addressResult.id;
    }

    return LifterDTO.fromEntity(await this.repo.save(lifter.toEntity()));
  }
}
