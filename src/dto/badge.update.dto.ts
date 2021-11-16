import { CompletedLifterBadge } from '../model/completedLifterBadges.entity';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Badge } from 'src/model/badges.entity';
import { User } from 'src/user.decorator';
import { BadgeDTO } from './badge.dto';

export class BadgeUpdateDTO
  extends BadgeDTO
  implements Readonly<BadgeUpdateDTO>
{
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  public static from(dto: Partial<BadgeUpdateDTO>) {
    const badge = new BadgeUpdateDTO();
    badge.id = dto.id;
    badge.name = dto.name;
    badge.requiredValue = dto.requiredValue;
    return badge;
  }

  public static fromEntity(entity: Badge): BadgeUpdateDTO {
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
    for (const property in this as BadgeUpdateDTO) {
      badge[property] = this[property];
    }
    return badge;
  }
}
