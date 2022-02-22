import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterEquipment } from '@src/model/lifterEquipment.entity';
import { LifterEquipmentController } from './lifter-equipment.controller';
import { LifterEquipmentService } from './lifter-equipment.service';

describe('LifterEquipmentController', () => {
  let controller: LifterEquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterEquipment]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      controllers: [LifterEquipmentController],
      providers: [LifterEquipmentService],
    }).compile();

    controller = module.get<LifterEquipmentController>(
      LifterEquipmentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
