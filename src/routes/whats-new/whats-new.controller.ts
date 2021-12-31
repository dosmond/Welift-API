import { WhatsNewService } from './whats-new.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('whats-new')
export class WhatsNewController {
  constructor(private readonly serv: WhatsNewService) {}

  @Get()
  public async getLatestWhatsNew() {
    return await this.serv.getLatestWhatsNew();
  }

  @Post('create')
  public async create();
}
