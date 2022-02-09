import { Lifter } from '@src/model/lifters.entity';
import { Module, Global } from '@nestjs/common';
import { LifterTransactionsService } from './lifter-transactions.service';
import { LifterTransactionsController } from './lifter-transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LifterTransaction, Lifter])],
  controllers: [LifterTransactionsController],
  providers: [LifterTransactionsService],
  exports: [LifterTransactionsService],
})
export class LifterTransactionsModule {}
