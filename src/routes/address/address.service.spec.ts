import { AddressDTO } from '@src/dto/address.dto';
import { Address } from '@src/model/addresses.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { ConnectionOptions, createConnection, Repository } from 'typeorm';
import { configService } from '@src/config/config.service';
import { AddressController } from './address.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

describe('AddressService', () => {
  let service: AddressService;
  let currentAddresses: Address[];
  let addressRepo: Repository<Address>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Address]),
      ],
      providers: [AddressService],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepo = module.get(getRepositoryToken(Address));
    currentAddresses = await addressRepo.find({
      relations: ['bookingStart', 'bookingEnd', 'lifter'],
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    it('should return the address with the corresponding id', async () => {
      let currentAddress: Address;
      let created = true;
      if (currentAddresses.length > 0) {
        currentAddress = currentAddresses[0];
        created = false;
      } else {
        currentAddress = await addressRepo.save(
          new Address({
            street: 'test',
            street2: 'test2',
            city: 'city',
            state: 'state',
            postalCode: 'postalCode',
          }),
        );
      }
      const address = await service.getById(null, currentAddress.id);
      expect(address.id).toEqual(currentAddress.id);
      expect(address?.bookingEnd?.id).toEqual(currentAddress?.bookingEnd?.id);
      expect(address?.lifter?.id).toEqual(currentAddress?.lifter?.id);
      expect(address?.bookingStart?.id).toEqual(
        currentAddress?.bookingStart?.id,
      );

      if (created) {
        await addressRepo.delete({ id: currentAddress.id });
      }
    });
  });

  describe('create', () => {
    it('should create a single address and return the new entity', async () => {
      const addressToCreate = new AddressDTO({
        street: 'test',
        street2: 'test2',
        city: 'city',
        state: 'state',
        postalCode: 'postalCode',
      });
      const newAddress = await service.create(null, addressToCreate);

      expect(newAddress.street).toEqual(addressToCreate.street);
    });
  });
});
