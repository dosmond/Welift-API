import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class ThumbtackBusiness implements Readonly<ThumbtackBusiness> {
  @ApiProperty()
  name: string;

  constructor(init?: Partial<ThumbtackBusiness>) {
    Object.assign(this, init);
  }
}

export class ThumbtackCustomer implements Readonly<ThumbtackCustomer> {
  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  constructor(init?: Partial<ThumbtackCustomer>) {
    Object.assign(this, init);
  }
}

export class ThumbtackLocation implements Readonly<ThumbtackLocation> {
  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zipCode: string;

  constructor(init?: Partial<ThumbtackLocation>) {
    Object.assign(this, init);
  }
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

  constructor(init?: Partial<ThumbtackRequest>) {
    Object.assign(this, init);
  }
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

  constructor(init?: Partial<LeadThumbtackDTO>) {
    Object.assign(this, init);
  }
}
