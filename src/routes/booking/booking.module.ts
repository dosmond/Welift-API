import { Partners } from './../../model/Partners.entity';
import { PartnerReferral } from './../../model/partnerReferrals.entity';
import { TextClient } from '../../helper/text.client';
import { GoogleCalendarApiHelper } from './../../helper/googleCalendar.helper';
import { EmailClient } from '../../helper/email.client';
import { Booking } from './../../model/booking.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    TypeOrmModule.forFeature([PartnerReferral]),
    TypeOrmModule.forFeature([Partners]),
  ],
  controllers: [BookingController],
  providers: [BookingService, EmailClient, TextClient, GoogleCalendarApiHelper],
})
export class BookingModule {}
