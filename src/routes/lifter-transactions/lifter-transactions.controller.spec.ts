import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Address } from '@src/model/addresses.entity';
import { Lifter } from '@src/model/lifters.entity';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';
import { LifterTransactionsController } from './lifter-transactions.controller';
import { LifterTransactionsService } from './lifter-transactions.service';

describe('LifterTransactionsController', () => {
  let controller: LifterTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifterTransactionsController],
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterTransaction, Address, Lifter]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      providers: [LifterTransactionsService],
    }).compile();

    controller = module.get<LifterTransactionsController>(
      LifterTransactionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
