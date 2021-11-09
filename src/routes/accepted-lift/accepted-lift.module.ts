import { Module } from '@nestjs/common';
import { AcceptedLiftController } from './accepted-lift.controller';
import { AcceptedLiftService } from './accepted-lift.service';

@Module({
  controllers: [AcceptedLiftController],
  providers: [AcceptedLiftService]
})
export class AcceptedLiftModule {}
