import { IsString } from 'class-validator';

export class ReferrerBonusEvent {
  @IsString()
  referredCode: string;

  @IsString()
  referredName: string;

  constructor(init?: Partial<ReferrerBonusEvent>) {
    Object.assign(this, init);
  }
}
