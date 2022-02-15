import { AuthModule } from './../../auth/auth.module';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { LifterTransaction } from './../../model/lifterTransaction.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Lifter } from '@src/model/lifters.entity';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';

describe('BankingController', () => {
  let controller: BankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Lifter, LifterTransaction]),
        AuthModule,
      ],
      controllers: [BankingController],
      providers: [BankingService, LifterTransactionsService],
    }).compile();

    controller = module.get<BankingController>(BankingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
