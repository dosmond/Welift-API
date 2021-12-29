import { Test, TestingModule } from '@nestjs/testing';
import { CheckrService } from './checkr.service';

describe('CheckrService', () => {
  let service: CheckrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckrService],
    }).compile();

    service = module.get<CheckrService>(CheckrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
