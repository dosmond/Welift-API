import { IsString, IsUUID } from 'class-validator';

export class CustomerPrepEvent {
  @IsUUID()
  liftId: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  name: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  constructor(init?: Partial<CustomerPrepEvent>) {
    Object.assign(this, init);
  }
}
