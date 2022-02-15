import { AuthModule } from './../../auth/auth.module';
import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { LifterTransaction } from './../../model/lifterTransaction.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Lifter } from '@src/model/lifters.entity';
import { BankingService } from './banking.service';

describe('BankingService', () => {
  let service: BankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankingService, LifterTransactionsService],
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Lifter, LifterTransaction]),
        AuthModule,
      ],
    }).compile();

    service = module.get<BankingService>(BankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
