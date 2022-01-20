import { LifterEquipmentDTO } from './../../dto/lifterEquipment.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Address } from '@src/model/addresses.entity';
import { Equipment } from '@src/model/equipment.entity';
import { LifterEquipment } from '@src/model/lifterEquipment.entity';
import { Lifter } from '@src/model/lifters.entity';
import { Repository } from 'typeorm';
import { LifterEquipmentService } from './lifter-equipment.service';

describe('LifterEquipmentService', () => {
  let service: LifterEquipmentService;
  let lifterEquipmentRepo: Repository<LifterEquipment>;
  let equipmentRepo: Repository<Equipment>;
  let lifterRepo: Repository<Lifter>;
  let addressRepo: Repository<Address>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterEquipment, Equipment, Lifter, Address]),
      ],
      providers: [LifterEquipmentService],
    }).compile();

    service = module.get<LifterEquipmentService>(LifterEquipmentService);
    lifterEquipmentRepo = module.get(getRepositoryToken(LifterEquipment));
    equipmentRepo = module.get(getRepositoryToken(Equipment));
    lifterRepo = module.get(getRepositoryToken(Lifter));
    addressRepo = module.get(getRepositoryToken(Address));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLifterCompletedVideos', () => {
    let lifter: Lifter;

    beforeEach(async () => {
      const { lifter: createdLifter } = await setup();
      lifter = createdLifter;
    });

    it('should return the correct lifter equipment', async () => {
      const equipment = await service.getLifterEquipment(lifter.id);
      expect(equipment.length).toEqual(1);
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('create', () => {
    let lifter: Lifter;
    let equipment: Equipment[];

    beforeEach(async () => {
      const { equipment: createdEquipment, lifter: createdLifter } =
        await setup();
      lifter = createdLifter;
      equipment = createdEquipment;
    });

    it('should successfully create a lifter equipment', async () => {
      const newEquipment = new LifterEquipmentDTO({
        lifterId: lifter.id,
        equipmentId: equipment[1].id,
      });
      const createdEquipment = await service.create(null, newEquipment);
      expect(createdEquipment.id).not.toBeNull();
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('delete', () => {
    let lifterEquipment: LifterEquipment;

    beforeEach(async () => {
      const { createdLifterEquipment } = await setup();
      lifterEquipment = createdLifterEquipment;
    });

    it('should successfully delete a lifter equipment', async () => {
      await service.delete(null, lifterEquipment.id);

      const completed = await lifterEquipmentRepo.findOne({
        id: lifterEquipment.id,
      });

      expect(completed).toBeUndefined();
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('deleteByLifterId', () => {
    let lifter: Lifter;
    let lifterEquipment: LifterEquipment;

    beforeEach(async () => {
      const { lifter: createdLifter, createdLifterEquipment } = await setup();
      lifter = createdLifter;
      lifterEquipment = createdLifterEquipment;
    });

    it('should successfully delete the lifter equipment associated with the lifter', async () => {
      await service.deleteByLifterId(lifter.id);

      const completed = await lifterEquipmentRepo.findOne({
        id: lifterEquipment.id,
      });

      expect(completed).toBeUndefined();
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  const setup = async () => {
    const equipment = [
      await equipmentRepo.save(
        new Equipment({
          name: 'Test1',
        }),
      ),
      await equipmentRepo.save(
        new Equipment({
          name: 'Test2',
        }),
      ),
    ];

    const lifter = await lifterRepo.save(
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
        lifterId: lifter.id,
        equipmentId: equipment[0].id,
      }),
    );

    return { equipment, lifter, createdLifterEquipment };
  };

  const cleanUp = async () => {
    const lifterEquipment = await lifterEquipmentRepo.find();

    for (const equipment of lifterEquipment) {
      await lifterEquipmentRepo.delete({ id: equipment.id });
    }

    const equipments = await equipmentRepo.find();
    for (const equipment of equipments) {
      await equipmentRepo.delete({ id: equipment.id });
    }

    const lifters = await lifterRepo.find();

    for (const lifter of lifters) {
      await lifterRepo.delete({ id: lifter.id });
    }

    const addresses = await addressRepo.find();
    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }
  };
});
