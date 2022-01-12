import { CompletedLifterBadge } from './../model/completedLifterBadges.entity';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Badge } from '@src/model/badges.entity';

export class BadgeDTO implements Readonly<BadgeDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNumber()
  requiredValue: number;

  @ApiProperty({ required: false })
  @IsOptional()
  completedLifterBadges: CompletedLifterBadge[];

  constructor(init?: Partial<BadgeDTO>) {
    Object.assign(this, init);
  }

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

  public toEntity() {
    const badge = new Badge();
    for (const property in this as BadgeDTO) badge[property] = this[property];
    return badge;
  }
}
