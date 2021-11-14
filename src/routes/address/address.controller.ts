import { AddressDTO } from './../../dto/address.dto';
import { AddressService } from './address.service';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { User } from 'src/user.decorator';
import { AddressMultipleDTO } from 'src/dto/address.multiple.dto';
import { AddressUpdateDTO } from 'src/dto/address.update.dto';

@Controller('address')
export class AddressController {
  constructor(private serv: AddressService) { }

  @Get()
  public async getById(@User() user: User, @Query() query: { id: string }): Promise<AddressDTO> {
    return await this.serv.getById(user, query.id)
  }

  @Post('create')
  public async create(@User() user: User, @Body() body: AddressDTO): Promise<AddressDTO> {
    return await this.serv.create(user, body)
  }

  @Post('create-all')
  public async createMultiple(@User() user: User, @Body() body: AddressMultipleDTO): Promise<AddressDTO[]> {
    return await this.serv.createMultiple(user, body)
  }

  @Put('update')
  public async update(@User() user: User, @Body() body: AddressUpdateDTO): Promise<AddressDTO> {
    return await this.serv.update(user, body)
  }
}
