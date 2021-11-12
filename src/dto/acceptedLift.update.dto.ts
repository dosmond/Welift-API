import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { AcceptedLiftDTO } from 'src/dto/acceptedLift.dto';
import { AcceptedLift } from 'src/model/acceptedLift.entity';
import { User } from 'src/user.decorator';

export class AcceptedLiftUpdateDTO extends AcceptedLiftDTO implements Readonly<AcceptedLiftUpdateDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string

  public static from(dto: Partial<AcceptedLiftDTO>): AcceptedLiftUpdateDTO {
    const lift = new AcceptedLiftUpdateDTO();
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

  public static fromEntity(entity: AcceptedLift): AcceptedLiftUpdateDTO {
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
        lifter: entity.lifter
      });

    return null
  }

  public toUpdateEntity(user: User = null): Partial<AcceptedLift> {
    const lift = new AcceptedLift()
    lift.id = this.id;
    if (this.lifterId !== undefined)
      lift.lifterId = this.lifterId

    if (this.liftId !== undefined)
      lift.liftId = this.liftId;

    if (this.clockInTime !== undefined)
      lift.clockInTime = this.clockInTime;

    if (this.clockOutTime !== undefined)
      lift.clockOutTime = this.clockOutTime;

    if (this.payrate !== undefined)
      lift.payrate = this.payrate;

    if (this.usePickupTruck !== undefined)
      lift.usePickupTruck = this.usePickupTruck;
    return lift
  }
}