import { AddressDTO } from '@src/dto/address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';

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
  @IsOptional()
  acquisitionChannel: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDTO)
  @IsDefined()
  address: AddressDTO;

  constructor(init?: Partial<LeadLandingDTO>) {
    Object.assign(this, init);
  }
}
