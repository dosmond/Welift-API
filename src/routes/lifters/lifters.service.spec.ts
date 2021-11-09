import { Test, TestingModule } from '@nestjs/testing';
import { LiftersService } from './lifters.service';

describe('LiftersService', () => {
  let service: LiftersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiftersService],
    }).compile();

    service = module.get<LiftersService>(LiftersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
