import { AddressDTO } from './address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressMultipleDTO implements Readonly<AddressMultipleDTO> {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDTO)
  addresses: AddressDTO[]
}