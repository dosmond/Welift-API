import { AuthModule } from './../../auth/auth.module';
import { Lifter } from '@src/model/lifters.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { BankingService } from './banking.service';
import { BankingController } from './banking.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Lifter]), AuthModule],
  controllers: [BankingController],
  providers: [BankingService],
  exports: [BankingService],
})
export class BankingModule {}
