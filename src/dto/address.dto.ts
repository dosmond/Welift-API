import { LifterDTO } from './lifter.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { Address } from '@src/model/addresses.entity';
import { User } from '@src/user.decorator';
import { BookingDTO } from './booking.dto';

export class AddressDTO implements Readonly<AddressDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  street: string;

  @ApiProperty({ required: true })
  @IsString()
  street2: string;

  @ApiProperty({ required: true })
  @IsString()
  city: string;

  @ApiProperty({ required: true })
  @IsString()
  state: string;

  @ApiProperty({ required: true })
  @IsString()
  postalCode: string;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  bookingStart: BookingDTO;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  bookingEnd: BookingDTO;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  lifter: LifterDTO;

  public static from(dto: Partial<AddressDTO>) {
    const address = new AddressDTO();
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
    const lift = new Address();
    for (const property in this as AddressDTO) lift[property] = this[property];
    return lift;
  }
}
