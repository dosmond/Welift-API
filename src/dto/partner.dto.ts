import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsNumber } from 'class-validator';
import { User } from '@src/user.decorator';
import { Partner } from '@src/model/partner.entity';

export class PartnerDTO implements Readonly<PartnerDTO> {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  totalCredits: number;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  referralCode: string;

  public static from(dto: Partial<PartnerDTO>): PartnerDTO {
    const partner = new PartnerDTO();
    for (const property in dto) partner[property] = dto[property];

    return partner;
  }

  public static fromEntity(entity: Partner): PartnerDTO {
    if (entity)
      return this.from({
        id: entity.id,
        companyName: entity.companyName,
        email: entity.email,
        totalCredits: entity.totalCredits,
        phone: entity.phone,
        logo: entity.logo,
        referralCode: entity.referralCode,
      });

    return null;
  }

  public toEntity(user: User = null): Partner {
    const partner = new Partner();
    for (const property in this as PartnerDTO)
      partner[property] = this[property];
    return partner;
  }
}
