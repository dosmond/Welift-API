import { Test, TestingModule } from '@nestjs/testing';
import { LiftersController } from './lifters.controller';

describe('LiftersController', () => {
  let controller: LiftersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiftersController],
    }).compile();

    controller = module.get<LiftersController>(LiftersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
