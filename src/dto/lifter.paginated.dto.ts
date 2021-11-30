import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { PaginatedDTO } from './base.paginated.dto';

export class LifterPaginatedDTO
  extends PaginatedDTO
  implements Readonly<LifterPaginatedDTO>
{
  @ApiProperty()
  @IsUUID()
  lifterId: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hideCompleted: boolean;
}
