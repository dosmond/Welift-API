import { AddressDTO } from './../../dto/address.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../../model/addresses.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '@src/user.decorator';
import { AddressMultipleDTO } from '@src/dto/address.multiple.dto';
import { AddressUpdateDTO } from '@src/dto/address.update.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private readonly repo: Repository<Address>,
  ) {}

  public async getById(user: User, id: string): Promise<AddressDTO> {
    return AddressDTO.fromEntity(
      await this.repo.findOne(
        { id: id },
        { relations: ['bookingStart', 'bookingEnd', 'lifter'] },
      ),
    );
  }

  public async create(user: User, address: AddressDTO): Promise<AddressDTO> {
    const dto = AddressDTO.from(address);
    return AddressDTO.fromEntity(await this.repo.save(dto.toEntity(user)));
  }

  public async createMultiple(
    user: User,
    address: AddressMultipleDTO,
  ): Promise<AddressDTO[]> {
    const returnValue: AddressDTO[] = [];
    const promises: Promise<void>[] = [];

    address.addresses.forEach((item) => {
      const dto = AddressDTO.from(item);
      promises.push(
        this.repo.save(dto.toEntity(user)).then((res) => {
          returnValue.push(AddressDTO.fromEntity(res));
        }),
      );
    });

    await Promise.all(promises);
    return returnValue;
  }

  public async update(
    user: User,
    address: AddressUpdateDTO,
  ): Promise<AddressDTO> {
    const dto = AddressUpdateDTO.from(address);

    if (!(await this.repo.findOne({ id: dto.id })))
      throw new BadRequestException('Address does not exist');

    return AddressDTO.fromEntity(await this.repo.save(dto.toEntity(user)));
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }
}
