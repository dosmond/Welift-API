import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, } from 'class-validator';
import { Address } from 'src/model/address.entity';

export class AddressDTO implements Readonly<AddressDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  street: string;

  @ApiProperty({ required: false })
  @IsString()
  street_2: string;

  @ApiProperty({ required: true })
  @IsString()
  city: string;

  @ApiProperty({ required: true })
  @IsString()
  state: string;

  @ApiProperty({ required: true })
  @IsString()
  postal_code: string;

  public static from(dto: Partial<AddressDTO>) {
    const address = new AddressDTO();
    address.id = dto.id;
    address.street = dto.street;
    address.street_2 = dto.street_2;
    address.city = dto.city;
    address.state = dto.state;
    address.postal_code = dto.postal_code;
    return it;
  }

  public static fromEntity(entity: Address) {
    return this.from({
      id: entity.id,
      street: entity.street,
      street_2: entity.street_2,
      city: entity.city,
      state: entity.state,
      postal_code: entity.postal_code
    });
  }

  public toEntity(address: Address = null) {
    const it = new Address();
    it.id = this.id;
    it.street = this.street;
    it.street_2 = this.street_2;
    it.city = this.city;
    it.state = this.state;
    it.postal_code = this.postal_code;
    it.createDateTime = new Date();
    it.createdBy = address ? address.id : null;
    it.lastChangedBy = address ? address.id : null;
    return it;
  }
}