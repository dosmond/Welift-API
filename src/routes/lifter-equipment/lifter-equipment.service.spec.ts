import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterEquipment } from '@src/model/lifterEquipment.entity';
import { LifterEquipmentService } from './lifter-equipment.service';

describe('LifterEquipmentService', () => {
  let service: LifterEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterEquipment]),
      ],
      providers: [LifterEquipmentService],
    }).compile();

    service = module.get<LifterEquipmentService>(LifterEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
