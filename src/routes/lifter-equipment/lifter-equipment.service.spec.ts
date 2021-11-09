import { Test, TestingModule } from '@nestjs/testing';
import { LifterEquipmentService } from './lifter-equipment.service';

describe('LifterEquipmentService', () => {
  let service: LifterEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifterEquipmentService],
    }).compile();

    service = module.get<LifterEquipmentService>(LifterEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
