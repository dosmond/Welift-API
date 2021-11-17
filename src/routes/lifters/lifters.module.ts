import { Address } from 'src/model/addresses.entity';
import { Lifter } from './../../model/lifters.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiftersController } from './lifters.controller';
import { LiftersService } from './lifters.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lifter]),
    TypeOrmModule.forFeature([Address]),
  ],
  controllers: [LiftersController],
  providers: [LiftersService],
})
export class LiftersModule {}
