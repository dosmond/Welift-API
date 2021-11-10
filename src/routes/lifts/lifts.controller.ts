import { LiftsService } from './lifts.service';
import { Controller, Get } from '@nestjs/common';

@Controller('lifts')
export class LiftsController {
  constructor(private serv: LiftsService) { }

  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }
}
