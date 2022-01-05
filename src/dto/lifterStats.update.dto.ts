import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Lifter } from '../model/lifters.entity';
import { LifterStats } from '../model/lifterStats.entity';
import { LifterStatsDTO } from './lifterStats.dto';

export class LifterStatsUpdateDTO
  implements Readonly<LifterStatsUpdateDTO>, LifterStatsDTO
{
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  lifterId: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  completedMoves: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalEarnedMoney: number;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Lifter)
  lifter: Lifter;

  public static from(dto: Partial<LifterStatsUpdateDTO>): LifterStatsUpdateDTO {
    const badge = new LifterStatsUpdateDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: LifterStats): LifterStatsUpdateDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        lifterId: entity.lifterId,
        completedMoves: entity.completedMoves,
        totalEarnedMoney: entity.totalEarnedMoney,
        lifter: entity.lifter,
      });
    }
    return null;
  }

  public toEntity(): LifterStats {
    const badge = new LifterStats();
    for (const property in this as LifterStatsUpdateDTO)
      badge[property] = this[property];
    return badge;
  }
}
