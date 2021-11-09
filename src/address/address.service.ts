import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../model/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private readonly repo: Repository<Address>) { }

  public async getAll() {
    return await this.repo.find();
  }
}