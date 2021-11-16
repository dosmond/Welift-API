import { Test, TestingModule } from '@nestjs/testing';
import { CompletedLifterBadgeService } from './completed-lifter-badge.service';

describe('CompletedLifterBadgeService', () => {
  let service: CompletedLifterBadgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
