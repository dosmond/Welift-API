import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class ThumbtackBusiness implements Readonly<ThumbtackBusiness> {
  @ApiProperty()
  name: string;
}

export class ThumbtackCustomer implements Readonly<ThumbtackCustomer> {
  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;
}

export class ThumbtackLocation implements Readonly<ThumbtackLocation> {
  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zipCode: string;
}

export class ThumbtackRequest implements Readonly<ThumbtackRequest> {
  @ApiProperty()
  category: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  schedule: string;

  @ApiProperty()
  location: ThumbtackLocation;
}

export class LeadThumbtackDTO implements Readonly<LeadThumbtackDTO> {
  @ApiProperty()
  leadID: string;

  @ApiProperty()
  createTimestamp: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ThumbtackRequest)
  request: ThumbtackRequest;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ThumbtackCustomer)
  customer: ThumbtackCustomer;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ThumbtackBusiness)
  business: ThumbtackBusiness;
}
