import { LeadDTO } from '@src/dto/lead.dto';
import { BookingDTO } from '@src/dto/booking.dto';
import { Lead } from './../model/leads.entity';
import { Booking } from '@src/model/booking.entity';
import { Note } from './../model/note.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class NoteDTO implements Readonly<NoteDTO> {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  leadId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  bookingId: string;

  @ApiProperty()
  @IsString()
  note: string;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => BookingDTO)
  booking: BookingDTO;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => LeadDTO)
  lead: LeadDTO;

  public static from(dto: Partial<NoteDTO>): NoteDTO {
    const note = new NoteDTO();
    for (const property in dto) note[property] = dto[property];

    return note;
  }

  public static fromEntity(entity: Note): NoteDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        leadId: entity.leadId,
        bookingId: entity.bookingId,
        note: entity.note,
        author: entity.author,
        booking: BookingDTO.fromEntity(entity.booking),
        lead: LeadDTO.fromEntity(entity.lead),
      });
    }
    return null;
  }

  public toEntity(): Note {
    const note = new Note();
    for (const property in this as NoteDTO) note[property] = this[property];
    return note;
  }
}
