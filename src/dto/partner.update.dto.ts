import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { Partners } from 'src/model/Partners.entity';
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
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNumber()
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

  public static from(dto: Partial<PartnerUpdateDTO>): PartnerUpdateDTO {
    const partner = new PartnerUpdateDTO();
    partner.id = dto.id;
    partner.companyName = dto.companyName;
    partner.email = dto.email;
    partner.totalCredits = dto.totalCredits;
    partner.phone = dto.phone;
    partner.logo = dto.logo;
    partner.referralCode = dto.referralCode;
    return partner;
  }

  public static fromEntity(entity: Partners): PartnerUpdateDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        companyName: entity.companyName,
        email: entity.email,
        phone: entity.phone,
        totalCredits: entity.totalCredits,
        logo: entity.logo,
        referralCode: entity.referralCode,
      });
    }
    return null;
  }

  public toEntity(user: User = null): Partners {
    const partner = new Partners();
    for (const property in this as PartnerUpdateDTO) {
      partner[property] = this[property];
    }
    return partner;
  }
}
