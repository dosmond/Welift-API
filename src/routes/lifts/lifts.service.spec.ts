import { Test, TestingModule } from '@nestjs/testing';
import { LiftsService } from './lifts.service';

describe('LiftsService', () => {
  let service: LiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiftsService],
    }).compile();

    service = module.get<LiftsService>(LiftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
