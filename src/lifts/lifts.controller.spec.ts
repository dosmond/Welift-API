import { Test, TestingModule } from '@nestjs/testing';
import { LiftsController } from './lifts.controller';

describe('LiftsController', () => {
  let controller: LiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiftsController],
    }).compile();

    controller = module.get<LiftsController>(LiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
