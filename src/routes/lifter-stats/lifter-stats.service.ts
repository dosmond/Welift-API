import { LifterStatsUpdateDTO } from './../../dto/lifterStats.update.dto';
import { LifterStatsDTO } from './../../dto/lifterStats.dto';
import { LifterStats } from './../../model/lifterStats.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class LifterStatsService {
  constructor(
    @InjectRepository(LifterStats)
    private readonly repo: Repository<LifterStats>,
  ) {}

  public async getLifterStats(lifterId: string): Promise<LifterStatsDTO> {
    return LifterStatsDTO.fromEntity(
      await this.repo.findOne({ where: { lifterId: lifterId } }),
    );
  }

  public async update(stats: LifterStatsUpdateDTO): Promise<LifterStatsDTO> {
    const lifterStats = await this.repo.findOne({ lifterId: stats.lifterId });
    const dto = LifterStatsUpdateDTO.from(stats);
    dto.id = lifterStats.id;
    return LifterStatsDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }

  public async deleteByLifterId(lifterId: string): Promise<DeleteResult> {
    return await this.repo.delete({ lifterId: lifterId });
  }
}
