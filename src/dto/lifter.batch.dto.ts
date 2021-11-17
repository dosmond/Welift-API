import { AddressDTO } from 'src/dto/address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LifterDTO } from './lifter.dto';

export class LifterBatchDTO implements Readonly<LifterBatchDTO> {
  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDTO)
  address: AddressDTO;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LifterDTO)
  lifter: LifterDTO;
}
