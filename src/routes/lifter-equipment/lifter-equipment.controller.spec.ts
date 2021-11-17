import { Test, TestingModule } from '@nestjs/testing';
import { LifterEquipmentController } from './lifter-equipment.controller';

describe('LifterEquipmentController', () => {
  let controller: LifterEquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifterEquipmentController],
    }).compile();

    controller = module.get<LifterEquipmentController>(
      LifterEquipmentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
