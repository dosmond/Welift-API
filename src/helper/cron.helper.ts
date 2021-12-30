import { EventNames } from './../enum/eventNames.enum';
import { ClockOutEvent } from './../events/clockout.event';
import { CronJobDescription } from './../model/cronjob.entity';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
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
  ) {}

  // Only Run at 9AM or 5PM
  @Cron('* * 9,17 * * *', {
    name: 'booking-location-count',
    timeZone: 'America/Denver',
  })
  public async checkBookingCount() {
    this.eventEmitter.emit(EventNames.CheckBookingCount);
  }

  @Cron(CronExpression.EVERY_3_HOURS, {
    name: 'check_passed_pc',
  })
  public async checkPassedBc() {
    this.eventEmitter.emit(EventNames.CheckPassedBc);
  }

  @Cron('0 0 * * Mon', {
    name: 'lifter-deletion',
    timeZone: 'America/Denver',
  })
  public async deleteFlaggedLifters() {
    this.eventEmitter.emit(EventNames.DeleteFlaggedLifters);
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
