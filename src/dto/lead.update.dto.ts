import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { LeadDTO } from './lead.dto';

export class LeadUpdateDTO extends LeadDTO implements Readonly<LeadUpdateDTO> {
  @ApiProperty()
  @IsUUID()
  id: string;
}
