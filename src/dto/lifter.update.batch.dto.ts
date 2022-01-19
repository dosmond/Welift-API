import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { LifterUpdateDTO } from './lifter.update.dto';
import { AddressUpdateDTO } from './address.update.dto';

export class LifterUpdateBatchDTO implements Readonly<LifterUpdateBatchDTO> {
  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressUpdateDTO)
  @IsOptional()
  @IsDefined()
  address: AddressUpdateDTO;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LifterUpdateDTO)
  @IsDefined()
  lifter: LifterUpdateDTO;

  constructor(init?: Partial<LifterUpdateBatchDTO>) {
    Object.assign(this, init);
  }
}
