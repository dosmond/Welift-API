import { LiftersService } from './../routes/lifters/lifters.service';
import {
  PushNotificationHelper,
  PushNotificationRequest,
} from './pushNotification.helper';
import { BookingLocationCountService } from './../routes/booking-location-count/bookingLocationCount.service';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { BookingLocationCount } from 'src/model/bookingLocationCount.entity';

@Injectable()
export class CronHelper {
  constructor(
    private schedulerReg: SchedulerRegistry,
    private locationService: BookingLocationCountService,
    private pushNotificationHelper: PushNotificationHelper,
    private lifterService: LiftersService,
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

  @Cron(CronExpression.EVERY_3_HOURS, {
    name: 'check_passed_pc',
  })
  public async checkPassedBc() {
    const lifters = await this.lifterService.getAllNotPassedBc();

    const promises: Promise<void>[] = [];
    lifters.forEach((lifter) => {
      const request = new PushNotificationRequest({
        topic: `/topics/${process.env.NODE_ENV}-${lifter.id}`,
        title: 'Background Check',
        message:
          'Complete your background check so you can start earning with Welift today!',
      });

      promises.push(
        this.pushNotificationHelper.sendPushNotificationToTopic(request),
      );
    });

    await Promise.all(promises);
  }

  @Cron('0 0 * * Mon', {
    name: 'lifter-deletion',
    timeZone: 'America/Denver',
  })
  public async deleteFlaggedLifters() {
    const lifters = await this.lifterService.getLiftersFlaggedForDeletion();

    const promises: Promise<void>[] = [];

    lifters.forEach((lifter) => {
      promises.push(this.lifterService.deleteLifter(lifter.toEntity()));
    });

    await Promise.all(promises);
  }
}
