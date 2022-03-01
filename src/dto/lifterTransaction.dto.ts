import { AcceptedLiftDTO } from '@src/dto/acceptedLift.dto';
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

export class LifterTransactionDTO implements Readonly<LifterTransactionDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsDateString()
  date: Date;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumber()
  remainingBalance: number;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isQuickDeposit: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isReferral: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fees: number;

  @ApiProperty({ required: true })
  @IsUUID()
  lifterId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  acceptedLiftId: string;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  lifter: LifterDTO;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  acceptedLift: AcceptedLiftDTO;

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
        acceptedLiftId: entity.acceptedLiftId,
        fees: entity.fees,
        amount: entity.amount,
        isReferral: entity.isReferral,
        lifter: LifterDTO.fromEntity(entity?.lifter),
        acceptedLift: AcceptedLiftDTO.fromEntity(entity?.acceptedLift),
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
