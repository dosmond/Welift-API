import { Module } from '@nestjs/common';
import { LifterEquipmentController } from './lifter-equipment.controller';
import { LifterEquipmentService } from './lifter-equipment.service';

@Module({
  controllers: [LifterEquipmentController],
  providers: [LifterEquipmentService]
})
export class LifterEquipmentModule {}
