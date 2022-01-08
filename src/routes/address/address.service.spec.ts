import { AddressUpdateDTO } from '@src/dto/address.update.dto';
import { AddressDTO } from '@src/dto/address.dto';
import { Address } from '@src/model/addresses.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { DeleteResult, Repository } from 'typeorm';
import { configService } from '@src/config/config.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AddressMultipleDTO } from '@src/dto/address.multiple.dto';

describe('AddressService', () => {
  let service: AddressService;
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    it('should return the address with the corresponding id', async () => {
      const currentAddress = await addressRepo.save(
        new Address({
          street: 'test',
          street2: 'test2',
          city: 'city',
          state: 'state',
          postalCode: 'postalCode',
        }),
      );

      const address = await service.getById(null, currentAddress.id);
      expect(address.id).toEqual(currentAddress.id);
      expect(address?.bookingEnd?.id).toEqual(currentAddress?.bookingEnd?.id);
      expect(address?.lifter?.id).toEqual(currentAddress?.lifter?.id);
      expect(address?.bookingStart?.id).toEqual(
        currentAddress?.bookingStart?.id,
      );
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

  describe('createMultiple', () => {
    it('should create multiple addresses and return all created entities', async () => {
      const address = new AddressDTO({
        street: 'test1',
        street2: 'test1',
        city: 'city',
        state: 'state',
        postalCode: 'postalCode',
      });

      const [one, two, three] = await service.createMultiple(
        null,
        new AddressMultipleDTO({
          addresses: [address, address, address],
        }),
      );
      expect(one.street).toEqual(address.street);
      expect(two.street).toEqual(address.street);
      expect(three.street).toEqual(address.street);
    });
  });

  describe('update', () => {
    it('should update the existing address', async () => {
      const address = new AddressDTO({
        street: 'test1',
        street2: 'test1',
        city: 'city',
        state: 'state',
        postalCode: 'postalCode',
      });

      const existing = await service.create(null, address);
      expect(existing.street).toEqual(address.street);
      existing.street = 'updated';
      await service.update(null, existing);
      const updated = await service.getById(null, existing.id);
      expect(updated.street).toEqual(existing.street);
    });

    it('should throw an error if the given id does not exist', async () => {
      const addressUpdate = new AddressUpdateDTO({
        id: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
        street: 'test',
      });

      try {
        await service.update(null, addressUpdate);
        expect(true).toBeFalsy();
      } catch {
        expect(true).toBeTruthy();
      }
    });
  });

  afterAll(async () => {
    const addresses = await addressRepo.find();
    const promises: Promise<DeleteResult>[] = [];
    addresses.forEach((address) => {
      promises.push(addressRepo.delete({ id: address.id }));
    });
    await Promise.all(promises);
  });
});
