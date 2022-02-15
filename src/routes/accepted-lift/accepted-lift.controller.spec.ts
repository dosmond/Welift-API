import { AuthModule } from './../../auth/auth.module';
import { Lifter } from '@src/model/lifters.entity';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { AcceptedLiftService } from './accepted-lift.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedLiftController } from './accepted-lift.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lift } from '@src/model/lifts.entity';
import { configService } from '@src/config/config.service';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';

describe('AcceptedLiftController', () => {
  let controller: AcceptedLiftController;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([
          AcceptedLift,
          Lift,
          Lifter,
          LifterTransaction,
        ]),
        AuthModule,
      ],
      controllers: [AcceptedLiftController],
      providers: [AcceptedLiftService, LifterTransactionsService],
    }).compile();

    controller = moduleRef.get<AcceptedLiftController>(AcceptedLiftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
