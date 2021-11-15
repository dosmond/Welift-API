import { GoogleCalendarApiHelper } from './../../helper/googleCalendar.helper';
import { EmailClient } from './../../helper/emailClient';
import { Booking } from './../../model/booking.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [BookingController],
  providers: [
    BookingService,
    EmailClient,
    GoogleCalendarApiHelper
  ]
})
export class BookingModule { }
