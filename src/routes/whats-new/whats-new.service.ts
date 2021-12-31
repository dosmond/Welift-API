import { WhatsNewUpdateDTO } from './../../dto/whatsNew.update.dto';
import { WhatsNewDTO } from './../../dto/whatsNew.dto';
import { WhatsNew } from '../../model/whatsnew.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class WhatsNewService {
  constructor(
    @InjectRepository(WhatsNew)
    private readonly repo: Repository<WhatsNew>,
  ) {}

  public async getLatestWhatsNew(): Promise<WhatsNewDTO> {
    return WhatsNewDTO.fromEntity(
      await this.repo.findOne({ order: { creationDate: 'DESC' } }),
    );
  }

  public async create(request: WhatsNewDTO): Promise<WhatsNewDTO> {
    const dto = WhatsNewDTO.from(request);
    return WhatsNewDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async update(request: WhatsNewUpdateDTO): Promise<WhatsNewUpdateDTO> {
    const dto = WhatsNewUpdateDTO.from(request);
    return WhatsNewUpdateDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async delete(whatsNewId: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: whatsNewId });
  }
}
