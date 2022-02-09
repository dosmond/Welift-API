import { Type } from 'class-transformer';
import { Lifter } from '@src/model/lifters.entity';
import { IsNumber, ValidateNested, IsString, IsBoolean } from 'class-validator';

export class PayoutEvent {
  @ValidateNested()
  @Type(() => Lifter)
  lifter: Lifter;

  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  fees: number;

  @IsBoolean()
  isQuickDeposit: boolean;

  constructor(init?: Partial<PayoutEvent>) {
    Object.assign(this, init);
  }
}
