import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { Address } from '@src/model/addresses.entity';
import { Booking } from '@src/model/booking.entity';
import { Lifter } from '@src/model/lifters.entity';
import { User } from '@src/user.decorator';
import { AddressDTO } from './address.dto';
import { BookingDTO } from './booking.dto';
import { LifterDTO } from './lifter.dto';

export class AddressUpdateDTO
  implements Readonly<AddressUpdateDTO>, AddressDTO
{
  @ApiProperty({ required: false })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  street: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  street2: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  bookingStart: BookingDTO;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  bookingEnd: BookingDTO;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  lifter: LifterDTO;

  public static from(dto: Partial<AddressUpdateDTO>) {
    const address = new AddressUpdateDTO();
    for (const property in dto) address[property] = dto[property];

    return address;
  }

  public static fromEntity(entity: Address) {
    if (entity) {
      return this.from({
        id: entity.id,
        street: entity.street,
        street2: entity.street2,
        city: entity.city,
        state: entity.state,
        postalCode: entity.postalCode,
        bookingStart: BookingDTO.fromEntity(entity.bookingStart),
        bookingEnd: BookingDTO.fromEntity(entity.bookingEnd),
        lifter: LifterDTO.fromEntity(entity.lifter),
      });
    }
    return null;
  }

  public toEntity(user: User = null) {
    const address = new Address();
    for (const property in this as AddressUpdateDTO)
      address[property] = this[property];

    return address;
  }
}
