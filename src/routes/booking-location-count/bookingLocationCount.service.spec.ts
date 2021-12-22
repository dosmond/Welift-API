import { Test, TestingModule } from '@nestjs/testing';
import { BookingLocationCountService } from './bookingLocationCount.service';

describe('BookingService', () => {
  let service: BookingLocationCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingLocationCountService],
    }).compile();

    service = module.get<BookingLocationCountService>(
      BookingLocationCountService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
