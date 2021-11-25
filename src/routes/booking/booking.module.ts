import { AcceptedLift } from 'src/model/acceptedLift.entity';
import { Lift } from 'src/model/lifts.entity';
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
import { Note } from 'src/model/note.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      AcceptedLift,
      PartnerReferral,
      Partners,
      Lift,
      Note,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, EmailClient, TextClient, GoogleCalendarApiHelper],
})
export class BookingModule {}
