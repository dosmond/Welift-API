import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Equipment } from 'src/model/equipment.entity';
import { EquipmentDTO } from './equipment.dto';
import { LifterEquipmentDTO } from './lifterEquipment.dto';

export class EquipmentUpdateDTO
  implements Readonly<EquipmentUpdateDTO>, EquipmentDTO
{
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LifterEquipmentDTO)
  lifterEquipment: LifterEquipmentDTO[];

  public static from(dto: Partial<EquipmentUpdateDTO>): EquipmentUpdateDTO {
    const badge = new EquipmentUpdateDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: Equipment): EquipmentUpdateDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        name: entity.name,
        lifterEquipment: entity.lifterEquipments.map((item) =>
          LifterEquipmentDTO.fromEntity(item),
        ),
      });
    }
    return null;
  }

  public toEntity(): Equipment {
    const badge = new Equipment();
    for (const property in this as EquipmentUpdateDTO)
      badge[property] = this[property];
    return badge;
  }
}
