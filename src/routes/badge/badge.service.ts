import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BadgeDTO } from 'src/dto/badge.dto';
import { BadgeUpdateDTO } from 'src/dto/badge.update.dto';
import { Badge } from 'src/model/badges.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge) private readonly repo: Repository<Badge>,
  ) {}

  public async getAll(): Promise<BadgeDTO[]> {
    return this.repo
      .find()
      .then((badges) => badges.map((badge) => BadgeDTO.fromEntity(badge)));
  }

  public async getById(id: string): Promise<BadgeDTO> {
    return BadgeDTO.fromEntity(await this.repo.findOne({ id: id }));
  }

  public async create(badge: BadgeDTO): Promise<BadgeDTO> {
    const dto = BadgeDTO.from(badge);
    return BadgeDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async update(badge: BadgeUpdateDTO): Promise<BadgeDTO> {
    const dto = BadgeUpdateDTO.from(badge);
    return BadgeDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }
}
