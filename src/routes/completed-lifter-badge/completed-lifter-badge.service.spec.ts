import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { CompletedLifterBadge } from '@src/model/completedLifterBadges.entity';
import { CompletedLifterBadgeController } from './completed-lifter-badge.controller';
import { CompletedLifterBadgeService } from './completed-lifter-badge.service';

describe('CompletedLifterBadgeService', () => {
  let service: CompletedLifterBadgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([CompletedLifterBadge]),
      ],
      controllers: [CompletedLifterBadgeController],
      providers: [CompletedLifterBadgeService],
    }).compile();

    service = module.get<CompletedLifterBadgeService>(
      CompletedLifterBadgeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
