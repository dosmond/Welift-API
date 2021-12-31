import { PushNotificationHelper } from './../../helper/pushNotification.helper';
import { BookingLocationCountController } from './bookingLocationCount.controller';
import { BookingLocationCount } from '../../model/bookingLocationCount.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingLocationCountService } from './bookingLocationCount.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingLocationCount])],
  controllers: [BookingLocationCountController],
  providers: [BookingLocationCountService, PushNotificationHelper],
})
export class BookingLocationCountModule {}
