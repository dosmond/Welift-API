import { Test, TestingModule } from '@nestjs/testing';
import { CheckrController } from './checkr.controller';

describe('CheckrController', () => {
  let controller: CheckrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckrController],
    }).compile();

    controller = module.get<CheckrController>(CheckrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
