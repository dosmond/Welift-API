import { EmailClient } from 'src/helper/email.client';
import { AWSS3Helper } from './../../helper/awss3.helper';
import { TextClient } from './../../helper/text.client';
import { LifterStats } from './../../model/lifterStats.entity';
import { Address } from 'src/model/addresses.entity';
import { Lifter } from './../../model/lifters.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiftersController } from './lifters.controller';
import { LiftersService } from './lifters.service';
import { PendingVerification } from 'src/model/pendingVerification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lifter,
      Address,
      LifterStats,
      PendingVerification,
    ]),
  ],
  controllers: [LiftersController],
  providers: [LiftersService, TextClient, AWSS3Helper, EmailClient],
})
export class LiftersModule {}
