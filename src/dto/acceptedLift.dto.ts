import { AcceptedLift } from 'src/model/acceptedLift.entity';
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
import { User } from 'src/user.decorator';

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
  @IsOptional()
  payrate: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  usePickupTruck: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  lift: Lift;

  @ApiProperty({ required: false })
  @IsOptional()
  lifter: Lifter;

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
        usePickupTruck: entity.usePickupTruck,
        lift: entity.lift,
        lifter: entity.lifter,
      });

    return null;
  }

  public toEntity(user: User = null): AcceptedLift {
    const lift = new AcceptedLift();
    lift.id = this.id;
    lift.lifterId = this.lifterId ?? null;
    lift.liftId = this.liftId ?? null;
    lift.clockInTime = this.clockInTime ?? null;
    lift.clockOutTime = this.clockOutTime ?? null;
    lift.payrate = this.payrate ?? null;
    lift.usePickupTruck = this.usePickupTruck ?? null;
    return lift;
  }
}
