import { WhatsNewUpdateDTO } from './../../dto/whatsNew.update.dto';
import { WhatsNewDTO } from './../../dto/whatsNew.dto';
import { WhatsNewService } from './whats-new.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

@Controller('whats-new')
export class WhatsNewController {
  constructor(private readonly serv: WhatsNewService) {}

  @Get()
  public async getLatestWhatsNew(): Promise<WhatsNewDTO> {
    return await this.serv.getLatestWhatsNew();
  }

  @Post('create')
  public async create(@Body() body: WhatsNewDTO): Promise<WhatsNewDTO> {
    return await this.serv.create(body);
  }

  @Put('update')
  public async update(
    @Body() body: WhatsNewUpdateDTO,
  ): Promise<WhatsNewUpdateDTO> {
    return await this.serv.update(body);
  }

  @Delete('delete')
  public async delete(
    @Query() query: { whatsNewId: string },
  ): Promise<DeleteResult> {
    return await this.serv.delete(query.whatsNewId);
  }
}
