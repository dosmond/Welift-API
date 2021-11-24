import { AddressDTO } from 'src/dto/address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { LifterUpdateDTO } from './lifter.update.dto';

export class LifterUpdateBatchDTO implements Readonly<LifterUpdateBatchDTO> {
  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDTO)
  @IsOptional()
  @IsDefined()
  address: AddressDTO;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LifterUpdateDTO)
  @IsDefined()
  lifter: LifterUpdateDTO;
}
