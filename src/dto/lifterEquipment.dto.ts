import { Equipment } from './../model/equipment.entity';
import { Lifter } from 'src/model/lifters.entity';
import { LifterEquipment } from '../model/lifterEquipment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { User } from 'src/user.decorator';

export class LifterEquipmentDTO implements Readonly<LifterEquipmentDTO> {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  lifterId: string;

  @ApiProperty()
  @IsUUID()
  equipmentId: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Equipment)
  equipment: Equipment;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Lifter)
  lifter: Lifter;

  public static from(dto: Partial<LifterEquipmentDTO>): LifterEquipmentDTO {
    const badge = new LifterEquipmentDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: LifterEquipment): LifterEquipmentDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        lifterId: entity.lifterId,
        equipmentId: entity.equipmentId,
        equipment: entity.equipment,
        lifter: entity.lifter,
      });
    }
    return null;
  }

  public toEntity(user: User = null): LifterEquipment {
    const badge = new LifterEquipment();
    for (const property in this as LifterEquipmentDTO)
      badge[property] = this[property];
    return badge;
  }
}
