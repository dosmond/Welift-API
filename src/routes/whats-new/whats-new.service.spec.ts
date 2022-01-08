import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { WhatsNew } from '@src/model/whatsnew.entity';
import { WhatsNewService } from './whats-new.service';

describe('TrainingVideosService', () => {
  let service: WhatsNewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([WhatsNew]),
      ],
      providers: [WhatsNewService],
    }).compile();

    service = module.get<WhatsNewService>(WhatsNewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
