import { BookingLocationCount } from './../../model/bookingLocationCount.entity';
import { SlackHelper } from './../../helper/slack.helper';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lift } from '@src/model/lifts.entity';
import { Partner } from '../../model/partner.entity';
import { PartnerReferral } from './../../model/partnerReferrals.entity';
import { GoogleCalendarApiHelper } from './../../helper/googleCalendar.helper';
import { Booking } from './../../model/booking.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Note } from '@src/model/note.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      BookingLocationCount,
      AcceptedLift,
      PartnerReferral,
      Partner,
      Lift,
      Note,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, GoogleCalendarApiHelper, SlackHelper],
})
export class BookingModule {}
