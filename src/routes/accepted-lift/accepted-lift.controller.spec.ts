import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedLiftController } from './accepted-lift.controller';

describe('AcceptedLiftController', () => {
  let controller: AcceptedLiftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcceptedLiftController],
    }).compile();

    controller = module.get<AcceptedLiftController>(AcceptedLiftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetById', () => {

    it('should reject')
  })
});
