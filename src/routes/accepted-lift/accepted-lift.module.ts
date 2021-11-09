import { Module } from '@nestjs/common';
import { AcceptedLiftController } from './accepted-lift.controller';

@Module({
  controllers: [AcceptedLiftController]
})
export class AcceptedLiftModule {}
