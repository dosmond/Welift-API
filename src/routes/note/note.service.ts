import { NoteUpdateDTO } from './../../dto/note.update.dto';
import { Note } from './../../model/note.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { NoteDTO } from '@src/dto/note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private readonly repo: Repository<Note>,
  ) {}

  public async getByBooking(bookingId: string): Promise<NoteDTO[]> {
    return await this.repo
      .find({ where: { bookingId: bookingId } })
      .then((items) => items.map((item) => NoteDTO.fromEntity(item)));
  }

  public async getByLead(leadId: string): Promise<NoteDTO[]> {
    return await this.repo
      .find({ where: { leadId: leadId } })
      .then((items) => items.map((item) => NoteDTO.fromEntity(item)));
  }

  public async create(note: NoteDTO): Promise<NoteDTO> {
    const dto = NoteDTO.from(note);
    return NoteDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async update(note: NoteUpdateDTO): Promise<NoteDTO> {
    const dto = NoteUpdateDTO.from(note);
    return NoteDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async updateLeadToBooking(
    leadId: string,
    bookingId: string,
  ): Promise<UpdateResult> {
    return await this.repo.update({ leadId: leadId }, { bookingId: bookingId });
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }

  public async deleteByBooking(bookingId: string): Promise<DeleteResult> {
    return await this.repo.delete({ bookingId: bookingId });
  }
}
