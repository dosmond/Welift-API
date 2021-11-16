import {
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';
import { AddressDTO } from './address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BookingDTO } from './booking.dto';

export class BookingBatchDTO implements Readonly<BookingBatchDTO> {
  @ApiProperty({ required: true })
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => AddressDTO)
  startingAddress: AddressDTO;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AddressDTO)
  endingAddress: AddressDTO;

  @ApiProperty({ required: true })
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => BookingDTO)
  booking: BookingDTO;

  @ApiProperty()
  @IsOptional()
  @IsString()
  referralCode: string;
}
