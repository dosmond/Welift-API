import {
  PushNotificationHelper,
  PushNotificationRequest,
} from './pushNotification.helper';
import { BookingLocationCountService } from './../routes/booking-location-count/bookingLocationCount.service';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { BookingLocationCount } from 'src/model/bookingLocationCount.entity';

@Injectable()
export class CronHelper {
  constructor(
    private schedulerReg: SchedulerRegistry,
    private locationService: BookingLocationCountService,
    private pushNotificationHelper: PushNotificationHelper,
  ) {}

  // Only Run at 9AM or 5PM
  @Cron('* * 9,17 * * *', {
    name: 'booking-location-count',
    timeZone: 'America/Denver',
  })
  public async checkBookingCount() {
    const rows: BookingLocationCount[] = await this.locationService.getAll();
    const promises: Promise<void | BookingLocationCount>[] = [];

    rows.forEach((row) => {
      if (row.count > 0) {
        // Don't send push notifications to production if you aren't production!
        const topic = `/topics/${process.env.NODE_ENV}-${row.state}`;

        const request = new PushNotificationRequest({
          topic: topic,
          title: 'New Lifts Available!',
          message: `${row.count} lift request(s) available. Earn more from jobs today!`,
        });

        row.count = 0;

        promises.push(
          this.pushNotificationHelper.sendPushNotificationToTopic(request),
          this.locationService.upsert(row),
        );
      }
    });

    await Promise.all(promises);
  }
}
