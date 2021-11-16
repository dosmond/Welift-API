import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { EquipmentDTO } from './equipment.dto';

export class EquipmentUpdateDTO
  extends EquipmentDTO
  implements Readonly<EquipmentUpdateDTO>
{
  @ApiProperty()
  @IsUUID()
  id: string;
}
