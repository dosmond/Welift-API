import { LifterEquipment } from './../../model/lifterEquipment.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifterEquipmentController } from './lifter-equipment.controller';
import { LifterEquipmentService } from './lifter-equipment.service';

@Module({
  imports: [TypeOrmModule.forFeature([LifterEquipment])],
  controllers: [LifterEquipmentController],
  providers: [LifterEquipmentService],
})
export class LifterEquipmentModule {}
