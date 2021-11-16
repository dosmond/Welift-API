import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';
import { Address } from 'src/model/addresses.entity';
import { Booking } from 'src/model/booking.entity';
import { Lifter } from 'src/model/lifters.entity';
import { User } from 'src/user.decorator';
import { AddressDTO } from './address.dto';

export class AddressUpdateDTO
  extends AddressDTO
  implements Readonly<AddressUpdateDTO>
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

  public static from(dto: Partial<AddressUpdateDTO>): AddressUpdateDTO {
    const address = new AddressUpdateDTO();
    address.id = dto.id;
    address.street = dto.street;
    address.street2 = dto.street2;
    address.city = dto.city;
    address.state = dto.state;
    address.postalCode = dto.postalCode;
    return address;
  }

  public static fromEntity(entity: Address): AddressUpdateDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        street: entity.street,
        street2: entity.street2,
        city: entity.city,
        state: entity.state,
        postalCode: entity.postalCode,
      });
    }
    return null;
  }

  public override toEntity(user: User = null): Address {
    const address = new Address();

    for (const property in this as AddressUpdateDTO) {
      address[property] = this[property];
    }

    // if (this.postalCode)
    //   address.postalCode = this.postalCode;
    // it.createDateTime = new Date();
    // it.createdBy = user ? user.sub : null;
    // it.lastChangedBy = user ? user.sub : null;
    return address;
  }
}
