import { Lift } from './../model/lifts.entity';
import { Note } from './../model/note.entity';
import { AddressDTO } from './address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsUUID, IsOptional, IsBoolean, IsDate, IsNumber } from 'class-validator';
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
  phone: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  distanceInfo: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  additionalInfo: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  specialItems: string

  @ApiProperty()
  @IsUUID()
  startingAddressId: string

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  endingAddressId: string

  @ApiProperty()
  @IsDate()
  startTime: Date

  @ApiProperty()
  @IsNumber()
  lifterCount: number

  @ApiProperty()
  @IsNumber()
  hoursCount: number

  @ApiProperty()
  @IsNumber()
  totalCost: number

  @ApiProperty()
  @IsOptional()
  @IsDate()
  creationDate: Date

  @ApiProperty()
  @IsString()
  stripeSessionId: string

  @ApiProperty()
  @IsDate()
  endTime: Date

  @ApiProperty()
  @IsOptional()
  @IsString()
  referralCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string

  @ApiProperty()
  @IsString()
  timezone: string

  @ApiProperty()
  @IsOptional()
  @Type(() => AddressDTO)
  startingAddress: AddressDTO

  @ApiProperty()
  @IsOptional()
  @Type(() => AddressDTO)
  endingAddress: AddressDTO

  @ApiProperty()
  @IsOptional()
  @Type(() => Note)
  notes: Note[]

  @ApiProperty()
  @IsOptional()
  @Type(() => Lift)
  lift: Lift

  public static from(dto: Partial<BookingDTO>): BookingDTO {
    const booking = new BookingDTO();
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
    return booking;
  }

  public static fromEntity(entity: Booking): BookingDTO {
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
    booking.id = this.id;
    booking.needsPickupTruck = this.needsPickupTruck;
    booking.name = this.name;
    booking.phone = this.phone;
    booking.email = this.email;
    booking.distanceInfo = this.distanceInfo;
    booking.additionalInfo = this.additionalInfo;
    booking.specialItems = this.specialItems;
    booking.startingAddressId = this.startingAddressId;
    booking.endingAddressId = this.endingAddressId;
    booking.startTime = this.startTime;
    booking.endTime = this.endTime;
    booking.lifterCount = this.lifterCount;
    booking.hoursCount = this.hoursCount;
    booking.totalCost = this.totalCost;
    booking.creationDate = this.creationDate;
    booking.stripeSessionId = this.stripeSessionId;
    booking.referralCode = this.referralCode;
    booking.status = this.status;
    booking.timezone = this.timezone;
    return booking;
  }
}