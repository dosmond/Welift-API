import { AddressDTO } from '@src/dto/address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsObject, ValidateNested } from 'class-validator';
import { LifterDTO } from './lifter.dto';

export class LifterBatchDTO implements Readonly<LifterBatchDTO> {
  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDTO)
  @IsDefined()
  address: AddressDTO;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LifterDTO)
  @IsDefined()
  lifter: LifterDTO;

  constructor(init?: Partial<LifterBatchDTO>) {
    Object.assign(this, init);
  }
}
