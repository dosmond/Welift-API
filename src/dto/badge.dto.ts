import { CompletedLifterBadge } from './../model/completedLifterBadges.entity';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Badge } from 'src/model/badges.entity';
import { User } from 'src/user.decorator';

export class BadgeDTO implements Readonly<BadgeDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
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
    for (const property in dto) {
      badge[property] = dto[property];
    }
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

  public toEntity() {
    const badge = new Badge();
    badge.id = this.id;
    badge.name = this.name;
    badge.requiredValue = this.requiredValue;

    // it.createDateTime = new Date();
    // it.createdBy = user ? user.sub : null;
    // it.lastChangedBy = user ? user.sub : null;
    return badge;
  }
}
