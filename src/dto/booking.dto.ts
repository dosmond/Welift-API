import { LiftDTO } from 'src/dto/lift.dto';
import { NoteDTO } from './note.dto';
import { AddressDTO } from './address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDate,
  IsNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Booking } from 'src/model/booking.entity';
import { User } from 'src/user.decorator';

export class BookingDTO implements Readonly<BookingDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  needsPickupTruck: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  distanceInfo: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  additionalInfo: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  specialItems: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  startingAddressId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  endingAddressId: string;

  @ApiProperty()
  @IsDateString()
  startTime: Date;

  @ApiProperty()
  @IsNumber()
  lifterCount: number;

  @ApiProperty()
  @IsNumber()
  hoursCount: number;

  @ApiProperty()
  @IsNumber()
  totalCost: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  creationDate: Date;

  @ApiProperty()
  @IsString()
  stripeSessionId: string;

  @ApiProperty()
  @IsDateString()
  endTime: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  referralCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  timezone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  calendarEventId: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  startingAddress: AddressDTO;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  endingAddress: AddressDTO;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NoteDTO)
  notes: NoteDTO[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => LiftDTO)
  lift: LiftDTO;

  public static from(dto: Partial<BookingDTO>): BookingDTO {
    const booking = new BookingDTO();

    for (const property in dto) {
      booking[property] = dto[property];
    }

    return booking;
  }

  public static fromEntity(entity: Booking): BookingDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        needsPickupTruck: entity.needsPickupTruck,
        name: entity.name,
        phone: BookingDTO.standardizePhoneNumber(entity.phone),
        email: entity.email,
        distanceInfo: entity.distanceInfo,
        additionalInfo: entity.additionalInfo,
        specialItems: entity.specialItems,
        startingAddressId: entity.startingAddressId,
        endingAddressId: entity.endingAddressId,
        startTime: entity.startTime,
        endTime: entity.endTime,
        lifterCount: entity.lifterCount,
        hoursCount: entity.hoursCount,
        totalCost: entity.totalCost,
        creationDate: entity.creationDate,
        stripeSessionId: entity.stripeSessionId,
        referralCode: entity.referralCode,
        status: entity.status,
        timezone: entity.timezone,
        calendarEventId: entity.calendarEventId,
        endingAddress: AddressDTO.fromEntity(entity.endingAddress),
        startingAddress: AddressDTO.fromEntity(entity.startingAddress),
        lift: LiftDTO.fromEntity(entity.lift),
        notes: entity.notes?.map((item) => NoteDTO.fromEntity(item)),
      });
    }
    return null;
  }

  public toEntity(user: User = null): Booking {
    const booking = new Booking();
    for (const property in this as BookingDTO) {
      if (property === 'phone')
        booking[property] = BookingDTO.standardizePhoneNumber(this[property]);
      else booking[property] = this[property];
    }

    return booking;
  }

  public static standardizePhoneNumber(phoneNumber: string): string {
    return phoneNumber?.replace(/[^\d\+]/g, '');
  }
}
