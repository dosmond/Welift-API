import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Badge } from '@src/model/badges.entity';
import { BadgeService } from './badge.service';

describe('BadgeService', () => {
  let service: BadgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Badge]),
      ],
      providers: [BadgeService],
    }).compile();

    service = module.get<BadgeService>(BadgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
