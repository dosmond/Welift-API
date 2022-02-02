import { Module } from '@nestjs/common';
import { LifterTransactionsService } from './lifter-transactions.service';
import { LifterTransactionsController } from './lifter-transactions.controller';

@Module({
  controllers: [LifterTransactionsController],
  providers: [LifterTransactionsService],
})
export class LifterTransactionsModule {}
