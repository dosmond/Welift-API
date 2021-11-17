import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LifterDTO } from './../../dto/lifter.dto';
import { Lifter } from 'src/model/lifters.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, Between } from 'typeorm';
import { User } from 'src/user.decorator';

@Injectable()
export class LiftersService {
  constructor(
    @InjectRepository(Lifter) private readonly repo: Repository<Lifter>,
  ) {}

  public async getById(user: User, id: string): Promise<LifterDTO> {
    return LifterDTO.fromEntity(
      await this.repo.findOne({ id: id }, { relations: [''] }),
    );
  }

  public async getByUserId(user: User, userId: string): Promise<LifterDTO> {
    return LifterDTO.fromEntity(
      await this.repo.findOne({ userId: userId }, { relations: [''] }),
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

    options.order = { startTime: order };

    // Pagination
    if (page && pageSize) {
      options.skip = (page - 1) * pageSize;
      options.take = pageSize;
    }

    return await this.repo
      .find(options)
      .then((items) => items.map((item) => LifterDTO.fromEntity(item)));
  }
}
