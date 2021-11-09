import { AddressService } from './address.service';
import { Controller, Get } from '@nestjs/common';

@Controller('address')
export class AddressController {
  constructor(private serv: AddressService) { }

  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }
}
