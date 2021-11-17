import { Note } from './../model/note.entity';
import { IsDateString } from 'class-validator';
import { Lead } from './../model/leads.entity';
import { LifterEquipment } from '../model/lifterEquipment.entity';
import { Equipment } from '../model/equipment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/user.decorator';

export class LeadDTO implements Readonly<LeadDTO> {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ttLeadId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  schedule: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  street: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  street2: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  referralCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  promoCode: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  creationDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Note)
  notes: Note[];

  public static from(dto: Partial<LeadDTO>): LeadDTO {
    const badge = new LeadDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: Lead): LeadDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        name: entity.name,
        phone: entity.phone,
        email: entity.email,
        street: entity.street,
        street2: entity.street2,
        city: entity.city,
        state: entity.state,
        postalCode: entity.postalCode,
        title: entity.title,
        description: entity.description,
        ttLeadId: entity.ttLeadId,
        businessName: entity.businessName,
        referralCode: entity.referralCode,
        promoCode: entity.promoCode,
        creationDate: entity.creationDate,
      });
    }
    return null;
  }

  public toEntity(): Lead {
    const lead = new Lead();
    for (const property in this as LeadDTO) lead[property] = this[property];
    return lead;
  }
}