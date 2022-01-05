import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Lift } from '@src/model/lifts.entity';
import { AcceptedLiftDTO } from './acceptedLift.dto';
import { BookingDTO } from './booking.dto';
import { LiftDTO } from './lift.dto';

export class LiftUpdateDTO implements Readonly<LiftUpdateDTO>, LiftDTO {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  bookingId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  currentLifterCount: number;

  @ApiProperty()
  @IsString()
  completionToken: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  liftStatus: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hasPickupTruck: boolean;

  @ApiProperty()
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcceptedLiftDTO)
  acceptedLifts: AcceptedLiftDTO[];

  @ApiProperty()
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => BookingDTO)
  booking: BookingDTO;

  public static from(dto: Partial<LiftUpdateDTO>): LiftUpdateDTO {
    const badge = new LiftUpdateDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: Lift): LiftUpdateDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        bookingId: entity.bookingId,
        currentLifterCount: entity.currentLifterCount,
        completionToken: entity.completionToken,
        liftStatus: entity.liftStatus,
        hasPickupTruck: entity.hasPickupTruck,
        acceptedLifts: entity.acceptedLifts.map((item) =>
          AcceptedLiftDTO.fromEntity(item),
        ),
        booking: BookingDTO.fromEntity(entity.booking),
      });
    }
    return null;
  }

  public toEntity(): Lift {
    const lift = new Lift();
    for (const property in this as LiftUpdateDTO)
      lift[property] = this[property];
    return lift;
  }
}
