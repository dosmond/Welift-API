import { AcceptedLiftService } from './accepted-lift.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedLiftController } from './accepted-lift.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lift } from '@src/model/lifts.entity';
import { configService } from '@src/config/config.service';

describe('AcceptedLiftController', () => {
  let controller: AcceptedLiftController;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([AcceptedLift, Lift]),
      ],
      controllers: [AcceptedLiftController],
      providers: [AcceptedLiftService],
    }).compile();

    controller = moduleRef.get<AcceptedLiftController>(AcceptedLiftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
