import { AuthModule } from './../../auth/auth.module';
import { Lifter } from '@src/model/lifters.entity';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lift } from './../../model/lifts.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiftsController } from './lifts.controller';
import { LiftsService } from './lifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lift, AcceptedLift, Lifter]), AuthModule],
  controllers: [LiftsController],
  providers: [LiftsService],
})
export class LiftsModule {}
