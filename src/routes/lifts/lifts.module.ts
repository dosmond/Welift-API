import { Module } from '@nestjs/common';
import { LiftsController } from './lifts.controller';

@Module({
  controllers: [LiftsController]
})
export class LiftsModule {}
