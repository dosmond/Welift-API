import { AddressDTO } from '@src/dto/address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

export class LeadLandingDTO implements Readonly<LeadLandingDTO> {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  referralCode: string;

  @ApiProperty()
  promoCode: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDTO)
  @IsDefined()
  address: AddressDTO;
}
