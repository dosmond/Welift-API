import { EventNames } from './../enum/eventNames.enum';
import { ClockOutEvent } from './../events/clockout.event';
import { CronJobDescription } from './../model/cronjob.entity';
import { LiftersService } from './../routes/lifters/lifters.service';
import {
  PushNotificationHelper,
  PushNotificationRequest,
} from './pushNotification.helper';
import { BookingLocationCountService } from './../routes/booking-location-count/bookingLocationCount.service';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { BookingLocationCount } from 'src/model/bookingLocationCount.entity';
import { CronJob } from 'cron';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CronHelper {
  constructor(
    private schedulerReg: SchedulerRegistry,
    @InjectRepository(CronJobDescription)
    private readonly cronRepo: Repository<CronJobDescription>,
    private eventEmitter: EventEmitter2,
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

  public async addCronJob(data: {
    cronName: string;
    params: any[];
    options: any;
  }) {
    const job = new CronJob(data.options.date, () => {
      this[data.cronName](...data.params);
    });

    this.schedulerReg.addCronJob(data.options.key, job);
    job.start();

    const cronJob = new CronJobDescription();
    cronJob.key = data.options.key;
    cronJob.data = data;
    await this.cronRepo.save(cronJob);
  }

  public async deleteCronJob(key: string) {
    this.schedulerReg.deleteCronJob(key);
    await this.cronRepo.delete({ key: key });
  }

  private autoClockOut(liftId: string) {
    console.log('emitting autoclockout');
    this.eventEmitter.emit(EventNames.AutoClockOut, new ClockOutEvent(liftId));
  }
}
