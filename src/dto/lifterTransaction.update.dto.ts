import { LifterTransactionDTO } from './lifterTransaction.dto';
import { LifterDTO } from './lifter.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  ValidateNested,
  IsDateString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { LifterTransaction } from '../model/lifterTransaction.entity';

export class LifterTransactionUpdateDTO
  implements Readonly<LifterTransactionUpdateDTO>, LifterTransactionDTO
{
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  remainingBalance: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isQuickDeposit: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fees: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  lifterId: string;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  lifter: LifterDTO;

  constructor(init?: Partial<LifterTransactionDTO>) {
    Object.assign(this, init);
  }

  public static from(dto: Partial<LifterTransactionDTO>) {
    const transaction = new LifterTransactionDTO();
    for (const property in dto) transaction[property] = dto[property];

    if (!transaction.lifter) delete transaction.lifter;

    return transaction;
  }

  public static fromEntity(entity: LifterTransaction) {
    if (entity) {
      return this.from({
        id: entity.id,
        lifterId: entity.lifterId,
        title: entity.title,
        date: entity.date,
        remainingBalance: entity.remainingBalance,
        isQuickDeposit: entity.isQuickDeposit,
        fees: entity.fees,
        amount: entity.amount,
        lifter: LifterDTO.fromEntity(entity?.lifter),
      });
    }
    return null;
  }

  public toEntity() {
    const transaction = new LifterTransaction();
    for (const property in this as LifterTransactionDTO)
      transaction[property] = this[property];
    return transaction;
  }
}
