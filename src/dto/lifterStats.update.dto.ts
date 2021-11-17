import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { LifterStatsDTO } from './lifterStats.dto';

export class LifterStatsUpdateDTO
  extends LifterStatsDTO
  implements Readonly<LifterStatsUpdateDTO>
{
  @ApiProperty()
  @IsUUID()
  id: string;
}
