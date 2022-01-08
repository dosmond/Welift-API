import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { AcceptedLiftDTO } from '../dto/acceptedLift.dto';
import { AcceptedLift } from '../model/acceptedLift.entity';
import { Lifter } from '../model/lifters.entity';
import { Lift } from '../model/lifts.entity';
import { User } from '../user.decorator';

export class AcceptedLiftUpdateDTO
  implements Readonly<AcceptedLiftUpdateDTO>, AcceptedLiftDTO
{
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  lifterId: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  clockInTime: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  clockOutTime: Date;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  liftId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  payrate: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalPay: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  usePickupTruck: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  lift: Lift;

  @ApiProperty({ required: false })
  @IsOptional()
  lifter: Lifter;

  public static from(
    dto: Partial<AcceptedLiftUpdateDTO>,
  ): AcceptedLiftUpdateDTO {
    const lift = new AcceptedLiftUpdateDTO();
    for (const property in dto) lift[property] = dto[property];

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
        totalPay: entity.totalPay,
        usePickupTruck: entity.usePickupTruck,
        lift: entity.lift,
        lifter: entity.lifter,
      });

    return null;
  }

  public toEntity(user: User = null): AcceptedLift {
    const lift = new AcceptedLiftDTO();
    for (const property in this as AcceptedLiftUpdateDTO)
      lift[property] = this[property];

    return lift;
  }
}
