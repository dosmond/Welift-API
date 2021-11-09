import { Module } from '@nestjs/common';
import { LiftsController } from './lifts.controller';
import { LiftsService } from './lifts.service';

@Module({
  controllers: [LiftsController],
  providers: [LiftsService]
})
export class LiftsModule {}
