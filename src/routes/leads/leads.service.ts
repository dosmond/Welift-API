import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { EmailClient } from './../../helper/email.client';
import { Lead } from './../../model/leads.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, Between } from 'typeorm';
import { LeadDTO } from '@src/dto/lead.dto';
import { LeadUpdateDTO } from '@src/dto/lead.update.dto';
import { LeadThumbtackDTO } from '@src/dto/lead.thumbtack.dto';
import { LeadLandingDTO } from '@src/dto/lead.landing.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private readonly repo: Repository<Lead>,
    private readonly emailClient: EmailClient,
  ) {}

  public async getById(id: string): Promise<LeadDTO> {
    return LeadDTO.fromEntity(
      await this.repo.findOne({ id: id }, { relations: ['notes'] }),
    );
  }

  public async getAll(request: PaginatedDTO): Promise<LeadDTO[]> {
    const { start, end, page, pageSize, order } = request;

    const options: FindManyOptions = {
      relations: ['notes'],
    };

    if (start && end) options.where = { creationDate: Between(start, end) };
    else if (start)
      options.where = { creationDate: Between(start, new Date()) };

    options.order = { creationDate: order };

    // Pagination
    if (page && pageSize) {
      options.skip = (page - 1) * pageSize;
      options.take = pageSize;
    }

    return await this.repo
      .find(options)
      .then((items) => items.map((item) => LeadDTO.fromEntity(item)));
  }

  public async count(request: PaginatedDTO): Promise<number> {
    const { start, end } = request;

    const options: FindManyOptions = {};

    // Time Queries
    if (start && end) options.where = { creationDate: Between(start, end) };
    else if (start)
      options.where = { creationDate: Between(start, new Date()) };

    const [, count] = await this.repo.findAndCount(options);
    return count;
  }

  public async createThumbtack(lead: LeadThumbtackDTO): Promise<LeadDTO> {
    const dto = LeadDTO.fromThumbtack(lead);
    return LeadDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async createLanding(lead: LeadLandingDTO): Promise<LeadDTO> {
    const dto = LeadDTO.fromLanding(lead);
    return LeadDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async sendBookingConvertEmail(
    email: string,
    data: string,
  ): Promise<void> {
    return await this.emailClient.sendLeadConvertEmail(email, data);
  }

  public async update(lead: LeadUpdateDTO): Promise<LeadUpdateDTO> {
    const dto = LeadUpdateDTO.from(lead);
    return LeadUpdateDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }
}
