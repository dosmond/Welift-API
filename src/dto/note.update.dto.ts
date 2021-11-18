import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Booking } from 'src/model/booking.entity';
import { Lead } from 'src/model/leads.entity';
import { Note } from 'src/model/note.entity';
import { NoteDTO } from './note.dto';

export class NoteUpdateDTO implements Readonly<NoteUpdateDTO>, NoteDTO {
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
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  author: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Booking)
  booking: Booking;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Lead)
  lead: Lead;

  public static from(dto: Partial<NoteUpdateDTO>): NoteUpdateDTO {
    const note = new NoteUpdateDTO();
    for (const property in dto) note[property] = dto[property];

    return note;
  }

  public static fromEntity(entity: Note): NoteUpdateDTO {
    if (entity) {
      return this.from({
        id: entity.id,
      });
    }
    return null;
  }

  public toEntity(): Note {
    const note = new Note();
    for (const property in this as NoteUpdateDTO)
      note[property] = this[property];
    return note;
  }
}
