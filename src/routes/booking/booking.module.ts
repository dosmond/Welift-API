import { AuthModule } from './../../auth/auth.module';
import { BookingLocationCount } from './../../model/bookingLocationCount.entity';
import { SlackHelper } from './../../helper/slack.helper';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Lift } from '@src/model/lifts.entity';
import { Partner } from '../../model/partner.entity';
import { PartnerReferral } from './../../model/partnerReferrals.entity';
import { GoogleCalendarApiHelper } from './../../helper/googleCalendar.helper';
import { Booking } from './../../model/booking.entity';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Note } from '@src/model/note.entity';

@Global()
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
    AuthModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, GoogleCalendarApiHelper, SlackHelper],
  exports: [BookingService],
})
export class BookingModule {}
