import { Lifter } from 'src/model/lifters.entity';
import { AcceptedLift } from 'src/model/acceptedLift.entity';
import { AcceptedLiftService } from './../accepted-lift/accepted-lift.service';
import { Lift } from './../../model/lifts.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiftsController } from './lifts.controller';
import { LiftsService } from './lifts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lift]),
    TypeOrmModule.forFeature([AcceptedLift]),
    TypeOrmModule.forFeature([Lifter]),
  ],
  controllers: [LiftsController],
  providers: [LiftsService, AcceptedLiftService],
})
export class LiftsModule {}
