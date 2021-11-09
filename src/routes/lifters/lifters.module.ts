import { Module } from '@nestjs/common';
import { LiftersController } from './lifters.controller';

@Module({
  controllers: [LiftersController]
})
export class LiftersModule {}
