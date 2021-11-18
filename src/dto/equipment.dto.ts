import { LifterEquipmentDTO } from './lifterEquipment.dto';
import { LifterEquipment } from './../model/lifterEquipment.entity';
import { Equipment } from './../model/equipment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class EquipmentDTO implements Readonly<EquipmentDTO> {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LifterEquipmentDTO)
  lifterEquipment: LifterEquipmentDTO[];

  public static from(dto: Partial<EquipmentDTO>): EquipmentDTO {
    const badge = new EquipmentDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: Equipment): EquipmentDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        name: entity.name,
        lifterEquipment: entity.lifterEquipments?.map((item) =>
          LifterEquipmentDTO.fromEntity(item),
        ),
      });
    }
    return null;
  }

  public toEntity(): Equipment {
    const badge = new Equipment();
    for (const property in this as EquipmentDTO)
      badge[property] = this[property];
    return badge;
  }
}
