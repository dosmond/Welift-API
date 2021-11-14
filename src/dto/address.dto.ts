import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';
import { Address } from 'src/model/addresses.entity';
import { Booking } from 'src/model/booking.entity';
import { Lifter } from 'src/model/lifters.entity';
import { User } from 'src/user.decorator';

export class AddressDTO implements Readonly<AddressDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  street: string;

  @ApiProperty({ required: false })
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
  @IsOptional()
  bookings: Booking[];

  @ApiProperty()
  @IsOptional()
  bookings2: Booking[];

  @ApiProperty()
  @IsOptional()
  lifters: Lifter[];

  public static from(dto: Partial<AddressDTO>) {
    const address = new AddressDTO();
    address.id = dto.id;
    address.street = dto.street;
    address.street2 = dto.street2;
    address.city = dto.city;
    address.state = dto.state;
    address.postalCode = dto.postalCode;
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
        postalCode: entity.postalCode
      });
    }
    return null
  }

  public toEntity(user: User = null) {
    const it = new Address();
    it.id = this.id;
    it.street = this.street;
    it.street2 = this.street2;
    it.city = this.city;
    it.state = this.state;
    it.postalCode = this.postalCode;
    // it.createDateTime = new Date();
    // it.createdBy = user ? user.sub : null;
    // it.lastChangedBy = user ? user.sub : null;
    return it;
  }
}