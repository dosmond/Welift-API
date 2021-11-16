import { IsOptional, IsString } from 'class-validator';
import { AddressDTO } from './address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BookingDTO } from './booking.dto';

export class BookingBatchDTO implements Readonly<BookingBatchDTO> {
  @ApiProperty({ required: true })
  @Type(() => AddressDTO)
  startingAddress: AddressDTO;

  @ApiProperty({ required: true })
  @IsOptional()
  @Type(() => AddressDTO)
  endingAddress: AddressDTO;

  @ApiProperty({ required: true })
  @Type(() => BookingDTO)
  booking: BookingDTO;

  @ApiProperty()
  @IsOptional()
  @IsString()
  referralCode: string;
}
