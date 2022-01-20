import { LifterDTO } from './lifter.dto';
import { BadgeDTO } from '@src/dto/badge.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CompletedLifterBadge } from '@src/model/completedLifterBadges.entity';
import { User } from '@src/user.decorator';

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
  @Type(() => BadgeDTO)
  badge: BadgeDTO;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LifterDTO)
  lifter: LifterDTO;

  constructor(init?: Partial<CompletedLifterBadgeDTO>) {
    Object.assign(this, init);
  }

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
        badge: BadgeDTO.fromEntity(entity.badge),
        lifter: LifterDTO.fromEntity(entity.lifter),
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
