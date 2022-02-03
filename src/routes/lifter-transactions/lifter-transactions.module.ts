import { Lifter } from '@src/model/lifters.entity';
import { Module } from '@nestjs/common';
import { LifterTransactionsService } from './lifter-transactions.service';
import { LifterTransactionsController } from './lifter-transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LifterTransaction, Lifter])],
  controllers: [LifterTransactionsController],
  providers: [LifterTransactionsService],
})
export class LifterTransactionsModule {}
