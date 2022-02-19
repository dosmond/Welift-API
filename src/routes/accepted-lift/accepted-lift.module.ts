import { AuthModule } from './../../auth/auth.module';
import { Lift } from '@src/model/lifts.entity';
import { AcceptedLift } from './../../model/acceptedLift.entity';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptedLiftController } from './accepted-lift.controller';
import { AcceptedLiftService } from './accepted-lift.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AcceptedLift, Lift]), AuthModule],
  controllers: [AcceptedLiftController],
  providers: [AcceptedLiftService],
  exports: [AcceptedLiftService],
})
export class AcceptedLiftModule {}
