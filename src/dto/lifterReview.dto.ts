import { Lifter } from '../model/lifters.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { LifterReview } from '../model/lifterReviews.entity';

export class LifterReviewDTO implements Readonly<LifterReviewDTO> {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  lifterId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @Max(5)
  @Min(1)
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Lifter)
  lifter: Lifter;

  public static from(dto: Partial<LifterReviewDTO>): LifterReviewDTO {
    const badge = new LifterReviewDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: LifterReview): LifterReviewDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        lifterId: entity.lifterId,
        content: entity.content,
        rating: entity.rating,
        lifter: entity.lifter,
      });
    }
    return null;
  }

  public toEntity(): LifterReview {
    const badge = new LifterReview();
    for (const property in this as LifterReviewDTO)
      badge[property] = this[property];
    return badge;
  }
}
