import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lift } from '@src/model/lifts.entity';
import { AcceptedLiftService } from './accepted-lift.service';

describe('AcceptedLiftService', () => {
  let service: AcceptedLiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([AcceptedLift, Lift])],
      providers: [AcceptedLiftService],
    }).compile();

    service = module.get<AcceptedLiftService>(AcceptedLiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
