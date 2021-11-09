import { AcceptedLift } from './../../model/acceptedLift.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptedLiftController } from './accepted-lift.controller';
import { AcceptedLiftService } from './accepted-lift.service';

@Module({
  imports: [TypeOrmModule.forFeature([AcceptedLift])],
  controllers: [AcceptedLiftController],
  providers: [AcceptedLiftService]
})
export class AcceptedLiftModule { }
