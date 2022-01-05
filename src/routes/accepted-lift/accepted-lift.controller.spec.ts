import { AcceptedLiftService } from './accepted-lift.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedLiftController } from './accepted-lift.controller';
import { mockAcceptedLiftService } from 'test/mocks/acceptedLiftService.mock';

describe('AcceptedLiftController', () => {
  let controller: AcceptedLiftController;
  let service: AcceptedLiftService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AcceptedLiftController],
      providers: [AcceptedLiftService],
    }).compile();

    controller = moduleRef.get<AcceptedLiftController>(AcceptedLiftController);
    service = moduleRef.get<AcceptedLiftService>(AcceptedLiftService);
  });

  describe('GetById', () => {
    it('should return null or undefined when the id doesnt exist', async () => {
      await controller.getById({ id: '' });
    });
  });
});
