import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Lead } from '@src/model/leads.entity';
import { LeadDTO } from './lead.dto';
import { NoteDTO } from './note.dto';

export class LeadUpdateDTO implements Readonly<LeadUpdateDTO>, LeadDTO {
  @ApiProperty()
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
  @Type(() => NoteDTO)
  notes: NoteDTO[];

  public static from(dto: Partial<LeadUpdateDTO>): LeadUpdateDTO {
    const lead = new LeadUpdateDTO();
    for (const property in dto) lead[property] = dto[property];

    return lead;
  }

  public static fromEntity(entity: Lead): LeadUpdateDTO {
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
        notes: entity.notes?.map((item) => NoteDTO.fromEntity(item)),
      });
    }
    return null;
  }

  public toEntity(): Lead {
    const lead = new Lead();
    for (const property in this as LeadUpdateDTO)
      lead[property] = this[property];
    return lead;
  }
}
