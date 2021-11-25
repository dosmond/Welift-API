import { TextClient } from './../../helper/text.client';
import { Lifter } from 'src/model/lifters.entity';
import { AcceptedLift } from 'src/model/acceptedLift.entity';
import { AcceptedLiftService } from './../accepted-lift/accepted-lift.service';
import { Lift } from './../../model/lifts.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiftsController } from './lifts.controller';
import { LiftsService } from './lifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lift, AcceptedLift, Lifter])],
  controllers: [LiftsController],
  providers: [LiftsService, AcceptedLiftService, TextClient],
})
export class LiftsModule {}
