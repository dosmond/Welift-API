import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PushNotificationHelper } from '@src/helper/pushNotification.helper';
import { BookingLocationCount } from '@src/model/bookingLocationCount.entity';
import { BookingLocationCountService } from './bookingLocationCount.service';

describe('BookingService', () => {
  let service: BookingLocationCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([BookingLocationCount]),
      ],
      providers: [BookingLocationCountService, PushNotificationHelper],
    }).compile();

    service = module.get<BookingLocationCountService>(
      BookingLocationCountService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
