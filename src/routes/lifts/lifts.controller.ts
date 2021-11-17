import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LiftsService } from './lifts.service';
import { Controller, Get, Query } from '@nestjs/common';
import { LiftDTO } from 'src/dto/lift.dto';

@Controller('lifts')
export class LiftsController {
  constructor(private serv: LiftsService) {}

  @Get()
  public async getAll(@Query() query: PaginatedDTO): Promise<LiftDTO[]> {
    return await this.serv.getAll(query);
  }
}
