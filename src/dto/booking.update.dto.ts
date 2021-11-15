import { Lift } from '../model/lifts.entity';
import { Note } from '../model/note.entity';
import { AddressDTO } from './address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsUUID, IsOptional, IsBoolean, IsDate, IsNumber } from 'class-validator';
import { Address } from 'src/model/addresses.entity';
import { Booking } from 'src/model/booking.entity';
import { Lifter } from 'src/model/lifters.entity';
import { User } from 'src/user.decorator';
import { BookingDTO } from './booking.dto';

export class BookingUpdateDTO extends BookingDTO implements Readonly<BookingUpdateDTO> {
  @ApiProperty({ required: true })
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
  phone: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  startingAddressId: string

  @ApiProperty()
  @IsOptional()
  @IsDate()
  startTime: Date

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  lifterCount: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  hoursCount: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalCost: number

  @ApiProperty()
  @IsOptional()
  @IsString()
  stripeSessionId: string

  @ApiProperty()
  @IsOptional()
  @IsDate()
  endTime: Date

  @ApiProperty()
  @IsString()
  timezone: string

  public static from(dto: Partial<BookingUpdateDTO>): BookingUpdateDTO {
    const booking = new BookingUpdateDTO();
    booking.id = dto.id;
    booking.needsPickupTruck = dto.needsPickupTruck;
    booking.name = dto.name;
    booking.phone = dto.phone;
    booking.email = dto.email;
    booking.distanceInfo = dto.distanceInfo;
    booking.additionalInfo = dto.additionalInfo;
    booking.specialItems = dto.specialItems;
    booking.startingAddressId = dto.startingAddressId;
    booking.endingAddressId = dto.endingAddressId;
    booking.startTime = dto.startTime;
    booking.endTime = dto.endTime;
    booking.lifterCount = dto.lifterCount;
    booking.hoursCount = dto.hoursCount;
    booking.totalCost = dto.totalCost;
    booking.creationDate = dto.creationDate;
    booking.stripeSessionId = dto.stripeSessionId;
    booking.referralCode = dto.referralCode;
    booking.status = dto.status;
    booking.timezone = dto.timezone;
    booking.calendarEventId = dto.calendarEventId;
    return booking;
  }

  public static fromEntity(entity: Booking): BookingUpdateDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        needsPickupTruck: entity.needsPickupTruck,
        name: entity.name,
        phone: entity.phone,
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
        timezone: entity.timezone
      });
    }
    return null
  }

  public toEntity(user: User = null): Booking {
    const booking = new Booking();
    for (const property in (this as BookingUpdateDTO)) {
      booking[property] = this[property]
    }
    return booking;
  }
}