import { Module } from '@nestjs/common';
import { LiftersController } from './lifters.controller';
import { LiftersService } from './lifters.service';

@Module({
  controllers: [LiftersController],
  providers: [LiftersService]
})
export class LiftersModule {}
