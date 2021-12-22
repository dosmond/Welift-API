import { LifterReviewDTO } from './../../dto/lifterReview.dto';
import { LifterReview } from './../../model/lifterReviews.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class LifterReviewsService {
  constructor(
    @InjectRepository(LifterReview)
    private readonly repo: Repository<LifterReview>,
  ) {}

  public async getLifterReviews(lifterId: string): Promise<LifterReviewDTO[]> {
    return await this.repo
      .find({ where: { lifterId: lifterId } })
      .then((items) => items.map((item) => LifterReviewDTO.fromEntity(item)));
  }

  public async create(review: LifterReviewDTO): Promise<LifterReviewDTO> {
    const dto = LifterReviewDTO.from(review);
    return LifterReviewDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }

  public async deleteByLifterId(lifterId: string): Promise<DeleteResult> {
    return await this.repo.delete({ lifterId: lifterId });
  }
}
