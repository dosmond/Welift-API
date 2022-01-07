import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { TextClient } from '@src/helper/text.client';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lifter } from '@src/model/lifters.entity';
import { Lift } from '@src/model/lifts.entity';
import { AcceptedLiftService } from '../accepted-lift/accepted-lift.service';
import { LiftsService } from './lifts.service';

describe('LiftsService', () => {
  let service: LiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Lift, AcceptedLift, Lifter]),
      ],
      providers: [LiftsService, AcceptedLiftService, TextClient],
    }).compile();

    service = module.get<LiftsService>(LiftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
