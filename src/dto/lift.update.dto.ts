import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { LiftDTO } from './lift.dto';

export class LiftUpdateDTO extends LiftDTO implements Readonly<LiftUpdateDTO> {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  bookingId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  completionToken: string;
}
