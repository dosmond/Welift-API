import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedLiftService } from './accepted-lift.service';

describe('AcceptedLiftService', () => {
  let service: AcceptedLiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcceptedLiftService],
    }).compile();

    service = module.get<AcceptedLiftService>(AcceptedLiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
