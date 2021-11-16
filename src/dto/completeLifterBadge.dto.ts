import { Lifter } from 'src/model/lifters.entity';
import { Badge } from 'src/model/badges.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CompletedLifterBadge } from 'src/model/completedLifterBadges.entity';
import { User } from 'src/user.decorator';

export class CompletedLifterBadgeDTO
  implements Readonly<CompletedLifterBadgeDTO>
{
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  lifterId: string;

  @ApiProperty()
  @IsUUID()
  badgeId: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Badge)
  badge: Badge;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Lifter)
  lifter: Lifter;

  public static from(
    dto: Partial<CompletedLifterBadgeDTO>,
  ): CompletedLifterBadgeDTO {
    const badge = new CompletedLifterBadgeDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(
    entity: CompletedLifterBadge,
  ): CompletedLifterBadgeDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        lifterId: entity.lifterId,
        badgeId: entity.badgeId,
        badge: entity.badge,
        lifter: entity.lifter,
      });
    }
    return null;
  }

  public toEntity(user: User = null): CompletedLifterBadge {
    const badge = new CompletedLifterBadge();
    for (const property in this as CompletedLifterBadgeDTO)
      badge[property] = this[property];
    return badge;
  }
}
