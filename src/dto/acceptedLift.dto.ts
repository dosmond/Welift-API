import { AcceptedLift } from 'src/model/acceptedLift.entity';
import { Lifter } from './../model/lifters.entity';
import { Lift } from './../model/lifts.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsObject, IsUUID, } from 'class-validator';
import { User } from 'src/user.decorator';

export class AcceptedLiftDTO implements Readonly<AcceptedLiftDTO> {
  @ApiProperty({ required: false })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsUUID()
  lifterId: string;

  @ApiProperty({ required: false })
  @IsDate()
  clockInTime: Date;

  @ApiProperty({ required: false })
  @IsDate()
  clockOutTime: Date;

  @ApiProperty({ required: false })
  @IsUUID()
  liftId: string;

  @ApiProperty({ required: true })
  @IsNumber()
  payrate: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  usePickupTruck: boolean;

  @ApiProperty({ required: false })
  @IsObject()
  lift: Lift;

  @ApiProperty({ required: false })
  @IsObject()
  lifter: Lifter;

  public static from(dto: Partial<AcceptedLiftDTO>): AcceptedLiftDTO {
    const lift = new AcceptedLiftDTO();
    lift.id = dto.id;
    lift.lifterId = dto.lifterId;
    lift.liftId = dto.liftId;
    lift.clockInTime = dto.clockInTime;
    lift.clockOutTime = dto.clockOutTime;
    lift.payrate = dto.payrate;
    lift.usePickupTruck = dto.usePickupTruck;
    lift.lift = dto.lift;
    lift.lifter = dto.lifter;
    return lift;
  }

  public static fromEntity(entity: AcceptedLift): AcceptedLiftDTO {
    return this.from({
      id: entity.id,
      lifterId: entity.lifterId,
      liftId: entity.liftId,
      clockInTime: entity.clockInTime,
      clockOutTime: entity.clockOutTime,
      payrate: entity.payrate,
      usePickupTruck: entity.usePickupTruck,
      lift: entity.lift,
      lifter: entity.lifter
    });
  }

  public toEntity(user: User = null): AcceptedLift {
    const lift = new AcceptedLift();
    lift.id = this.id;
    lift.lifterId = this.lifterId;
    lift.liftId = this.liftId;
    lift.clockInTime = this.clockInTime;
    lift.clockOutTime = this.clockOutTime;
    lift.payrate = this.payrate;
    lift.usePickupTruck = this.usePickupTruck;
    return lift;
  }
}