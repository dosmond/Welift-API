import { AuthModule } from './../../auth/auth.module';
import { Lifter } from './../../model/lifters.entity';
import { EquipmentDTO } from './../../dto/equipment.dto';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { EquipmentUpdateDTO } from '@src/dto/equipment.update.dto';
import { Equipment } from '@src/model/equipment.entity';
import { LifterEquipment } from '@src/model/lifterEquipment.entity';
import { Repository } from 'typeorm';
import { EquipmentService } from './equipment.service';
import { Address } from '@src/model/addresses.entity';

describe('EquipmentService', () => {
  let service: EquipmentService;
  let equipmentRepo: Repository<Equipment>;
  let lifterRepo: Repository<Lifter>;
  let addressRepo: Repository<Address>;
  let lifterEquipmentRepo: Repository<LifterEquipment>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Equipment, LifterEquipment, Lifter, Address]),
        AuthModule,
      ],
      providers: [EquipmentService],
    }).compile();

    service = module.get<EquipmentService>(EquipmentService);
    equipmentRepo = module.get(getRepositoryToken(Equipment));
    lifterRepo = module.get(getRepositoryToken(Lifter));
    addressRepo = module.get(getRepositoryToken(Address));
    lifterEquipmentRepo = module.get(getRepositoryToken(LifterEquipment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await createTwoEquipment();
    });

    it('should return all equipment', async () => {
      expect((await service.getAll()).length).toEqual(2);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getById', () => {
    let equipment: Equipment[];
    beforeAll(async () => {
      equipment = await createTwoEquipment();
    });

    it('should return the expected equipment', async () => {
      expect((await service.getById(equipment[0].id)).id).toEqual(
        equipment[0].id,
      );
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('create', () => {
    it('should create an equipment', async () => {
      await service.create(
        new EquipmentDTO({
          name: 'TestTest',
        }),
      );

      expect((await equipmentRepo.find())[0].name).toEqual('TestTest');
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('update', () => {
    let equipment: Equipment[];
    beforeAll(async () => {
      equipment = await createTwoEquipment();
    });

    it('should update the Equipment', async () => {
      const equipmentDTO = EquipmentDTO.fromEntity(equipment[0]);
      equipmentDTO.name = 'UpdateTest';
      expect((await service.update(equipmentDTO)).name).toEqual('UpdateTest');
    });

    it('should throw a 400 error if the Equipment does not exist', async () => {
      expect(
        async () =>
          await service.update(
            new EquipmentUpdateDTO({
              id: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
              name: 'testUpdate',
            }),
          ),
      ).rejects.toEqual(new BadRequestException('Equipment does not exist'));
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('delete', () => {
    let equipment: Equipment;
    let lifterEquipment: LifterEquipment;

    beforeAll(async () => {
      const { createdEquipment, createdLifterEquipment } =
        await createAnEquipmentWithLifterEquipment();
      equipment = createdEquipment;
      lifterEquipment = createdLifterEquipment;
    });

    it('should delete the equipment and any lifter equipment associated with it', async () => {
      await service.delete(equipment.id);
      const deletedEquipment = await equipmentRepo.findOne({
        id: equipment.id,
      });

      expect(deletedEquipment).toBeUndefined();

      const deletedLifterEquipment = await lifterEquipmentRepo.findOne({
        id: lifterEquipment.id,
      });

      expect(deletedLifterEquipment).toBeUndefined();
    });

    afterAll(async () => {
      await cleanUpWithLifter();
    });
  });

  const createTwoEquipment = async () => {
    return [
      await equipmentRepo.save(
        new Equipment({
          name: 'Test1',
        }),
      ),
      await equipmentRepo.save(
        new Equipment({
          name: 'Test1',
        }),
      ),
    ];
  };

  const createAnEquipmentWithLifterEquipment = async () => {
    const createdEquipment = await equipmentRepo.save(
      new Equipment({
        name: 'Test1',
      }),
    );

    const createdLifter = await lifterRepo.save(
      new Lifter({
        firstName: 'test',
        lastName: 'test',
        phone: '8015555555',
        passedBc: false,
        bcInProgress: false,
        email: 'test@test.com',
        hasPickupTruck: true,
        status: 'contacted',
        userId: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
        addressId: (
          await addressRepo.save(
            new Address({
              street: 'test1',
              street2: 'test1',
              city: 'city',
              state: 'state',
              postalCode: 'postalCode',
            }),
          )
        ).id,
      }),
    );

    const createdLifterEquipment = await lifterEquipmentRepo.save(
      new LifterEquipment({
        lifterId: createdLifter.id,
        equipmentId: createdEquipment.id,
      }),
    );
    return { createdEquipment, createdLifter, createdLifterEquipment };
  };

  const cleanUp = async () => {
    const equipments = await equipmentRepo.find();
    for (const equipment of equipments) {
      await equipmentRepo.delete({ id: equipment.id });
    }
  };

  const cleanUpWithLifter = async () => {
    const lifterEquipment = await lifterEquipmentRepo.find();
    for (const equipment of lifterEquipment) {
      await lifterEquipmentRepo.delete({ id: equipment.id });
    }

    const lifters = await lifterRepo.find();
    for (const lifter of lifters) {
      await lifterRepo.delete({ id: lifter.id });
    }

    const addresses = await addressRepo.find();
    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }

    const equipments = await equipmentRepo.find();
    for (const equipment of equipments) {
      await equipmentRepo.delete({ id: equipment.id });
    }
  };
});
