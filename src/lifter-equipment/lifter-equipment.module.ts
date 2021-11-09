import { Module } from '@nestjs/common';
import { LifterEquipmentController } from './lifter-equipment.controller';

@Module({
  controllers: [LifterEquipmentController]
})
export class LifterEquipmentModule {}
