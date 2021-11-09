import { Lift } from './../../model/lifts.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiftsController } from './lifts.controller';
import { LiftsService } from './lifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lift])],
  controllers: [LiftsController],
  providers: [LiftsService]
})
export class LiftsModule { }
