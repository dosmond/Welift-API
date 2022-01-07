import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CronHelper, CronModule } from './../../helper/cron.helper';
import { EmailClient } from '@src/helper/email.client';
import { configService } from '@src/config/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleCalendarApiHelper } from '@src/helper/googleCalendar.helper';
import { PushNotificationHelper } from '@src/helper/pushNotification.helper';
import { SlackHelper } from '@src/helper/slack.helper';
import { TextClient } from '@src/helper/text.client';
import { AcceptedLift } from '@src/model/acceptedLift.entity';
import { Booking } from '@src/model/booking.entity';
import { BookingLocationCount } from '@src/model/bookingLocationCount.entity';
import { Lift } from '@src/model/lifts.entity';
import { Note } from '@src/model/note.entity';
import { Partner } from '@src/model/partner.entity';
import { PartnerReferral } from '@src/model/partnerReferrals.entity';
import { BookingLocationCountService } from '../booking-location-count/bookingLocationCount.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CronJobDescription } from '@src/model/cronjob.entity';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
          Booking,
          BookingLocationCount,
          CronJobDescription,
          AcceptedLift,
          PartnerReferral,
          Partner,
          Lift,
          Note,
        ]),
      ],
      controllers: [BookingController],
      providers: [
        BookingService,
        TextClient,
        GoogleCalendarApiHelper,
        SlackHelper,
        BookingLocationCountService,
        PushNotificationHelper,
        EmailClient,
        CronHelper,
        EventEmitter2,
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
