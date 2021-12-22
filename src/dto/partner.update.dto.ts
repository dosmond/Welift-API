import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { Partner } from 'src/model/partner.entity';
import { User } from 'src/user.decorator';
import { PartnerDTO } from './partner.dto';

export class PartnerUpdateDTO
  extends PartnerDTO
  implements Readonly<PartnerUpdateDTO>
{
  @ApiProperty({ required: false })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalCredits: number;

  @ApiProperty()
  @IsOptional()
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

  public static from(dto: Partial<PartnerUpdateDTO>): PartnerUpdateDTO {
    const partner = new PartnerUpdateDTO();
    for (const property in dto) partner[property] = dto[property];

    return partner;
  }

  public static fromEntity(entity: Partner): PartnerUpdateDTO {
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
    for (const property in this as PartnerUpdateDTO)
      partner[property] = this[property];
    return partner;
  }
}
