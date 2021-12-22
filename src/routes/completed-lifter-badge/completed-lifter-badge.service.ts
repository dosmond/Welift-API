import { CompletedLifterBadge } from './../../model/completedLifterBadges.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CompletedLifterBadgeDTO } from 'src/dto/completeLifterBadge.dto';
import { User } from 'src/user.decorator';

@Injectable()
export class CompletedLifterBadgeService {
  constructor(
    @InjectRepository(CompletedLifterBadge)
    private readonly repo: Repository<CompletedLifterBadge>,
  ) {}

  public async getById(id: string) {
    return CompletedLifterBadgeDTO.fromEntity(
      await this.repo.findOne({ id: id }, { relations: ['badge', 'lifter'] }),
    );
  }

  public async create(
    user: User,
    badge: CompletedLifterBadgeDTO,
  ): Promise<CompletedLifterBadgeDTO> {
    const dto = CompletedLifterBadgeDTO.from(badge);
    return CompletedLifterBadgeDTO.fromEntity(
      await this.repo.save(dto.toEntity(user)),
    );
  }

  public async delete(user: User, id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }

  public async deleteByLifterId(lifterId: string): Promise<DeleteResult> {
    return await this.repo.delete({ lifterId: lifterId });
  }
}
