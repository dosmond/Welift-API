import { Test, TestingModule } from '@nestjs/testing';
import { BookingLocationCountController } from './bookingLocationCount.controller';

describe('BookingLocationCount', () => {
  let controller: BookingLocationCountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingLocationCountController],
    }).compile();

    controller = module.get<BookingLocationCountController>(
      BookingLocationCountController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
