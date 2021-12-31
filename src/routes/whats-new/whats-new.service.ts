import { WhatsNew } from '../../model/whatsnew.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WhatsNewService {
  constructor(
    @InjectRepository(WhatsNew)
    private readonly repo: Repository<WhatsNew>,
  ) {}

  public async getLatestWhatsNew() {
    return await this.repo.findOne({ order: { creationDate: 'DESC' } });
  }
}
