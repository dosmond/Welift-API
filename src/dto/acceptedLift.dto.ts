import { AcceptedLift } from '../model/acceptedLift.entity';
import { Lifter } from '../model/lifters.entity';
import { Lift } from '../model/lifts.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { User } from '@src/user.decorator';

export class AcceptedLiftDTO implements Readonly<AcceptedLiftDTO> {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  lifterId: string;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  clockInTime: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  clockOutTime: Date;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  liftId: string;

  @ApiProperty({ required: false })
  @IsNumber()
  payrate: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalPay: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  usePickupTruck: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  lift: Lift;

  @ApiProperty({ required: false })
  @IsOptional()
  lifter: Lifter;

  constructor(init?: Partial<AcceptedLiftDTO>) {
    Object.assign(this, init);
  }

  public static from(dto: Partial<AcceptedLiftDTO>): AcceptedLiftDTO {
    const lift = new AcceptedLiftDTO();
    for (const property in dto) lift[property] = dto[property];

    return lift;
  }

  public static fromEntity(entity: AcceptedLift): AcceptedLiftDTO {
    if (entity)
      return this.from({
        id: entity.id,
        lifterId: entity.lifterId,
        liftId: entity.liftId,
        clockInTime: entity.clockInTime,
        clockOutTime: entity.clockOutTime,
        payrate: entity.payrate,
        totalPay: entity.totalPay,
        usePickupTruck: entity.usePickupTruck,
        lift: entity.lift,
        lifter: entity.lifter,
      });

    return null;
  }

  public toEntity(user: User = null): AcceptedLift {
    const lift = new AcceptedLift();
    for (const property in this as AcceptedLiftDTO)
      lift[property] = this[property];
    return lift;
  }
}
