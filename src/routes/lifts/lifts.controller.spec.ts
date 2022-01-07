import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { TextClient } from '@src/helper/text.client';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lifter } from '@src/model/lifters.entity';
import { Lift } from '@src/model/lifts.entity';
import { AcceptedLiftService } from '../accepted-lift/accepted-lift.service';
import { LiftsController } from './lifts.controller';
import { LiftsService } from './lifts.service';

describe('LiftsController', () => {
  let controller: LiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Lift, AcceptedLift, Lifter]),
      ],
      controllers: [LiftsController],
      providers: [LiftsService, AcceptedLiftService, TextClient],
    }).compile();

    controller = module.get<LiftsController>(LiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
