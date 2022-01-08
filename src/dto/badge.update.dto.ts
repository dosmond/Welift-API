import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BadgeDTO } from './badge.dto';
import { CompletedLifterBadge } from '@src/model/completedLifterBadges.entity';
import { Badge } from '@src/model/badges.entity';

export class BadgeUpdateDTO implements Readonly<BadgeUpdateDTO>, BadgeDTO {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  requiredValue: number;

  @ApiProperty({ required: false })
  @IsOptional()
  completedLifterBadges: CompletedLifterBadge[];

  public static from(dto: Partial<BadgeDTO>) {
    const badge = new BadgeDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: Badge) {
    if (entity) {
      return this.from({
        id: entity.id,
        name: entity.name,
        requiredValue: entity.requiredValue,
      });
    }
    return null;
  }

  public toEntity(): Badge {
    const badge = new Badge();
    for (const property in this as BadgeUpdateDTO)
      badge[property] = this[property];
    return badge;
  }
}
