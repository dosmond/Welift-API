import { HighRiskBookingDeletionEvent } from './../events/highRiskBookingDeletion.event';
import { PushNotificationHelper } from './pushNotification.helper';
import { CustomerPrepEvent } from './../events/customerPrep.event';
import { CronJobNames } from './../enum/cronJobNames.enum';
import { EventNames } from './../enum/eventNames.enum';
import { ClockOutEvent } from './../events/clockout.event';
import { CronJobData, CronJobDescription } from './../model/cronjob.entity';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import {
  Global,
  Injectable,
  OnApplicationBootstrap,
  Module,
  Logger,
} from '@nestjs/common';
import { CronJob } from 'cron';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CronHelper implements OnApplicationBootstrap {
  private readonly logger = new Logger(CronHelper.name);

  constructor(
    private schedulerReg: SchedulerRegistry,
    @InjectRepository(CronJobDescription)
    private readonly cronRepo: Repository<CronJobDescription>,
    private eventEmitter: EventEmitter2,
    private pushNotificationHelper: PushNotificationHelper,
  ) {}

  // On system restart, recover all the cron jobs that were
  // running and stored in db
  async onApplicationBootstrap() {
    const jobs = await this.cronRepo.find();
    jobs.forEach((job) => {
      const newRunTime = new Date(job.data.options.date);
      if (newRunTime <= new Date(Date.now())) {
        job.data.options.date = new Date(Date.now() + 10 * 1000);
      } else {
        job.data.options.date = newRunTime;
      }
      this.addCronJob(job.data, false);
    });
  }

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

  // Enable this when payments are fully out
  // @Cron('0 0 20 * * THU')
  // public async sendPaymentReminder() {
  //   await this.pushNotificationHelper.sendPaymentReminder();
  // }

  // Every Friday at 8:00 PM (America/Denver)
  @Cron('0 0 20 * * FRI', {
    name: 'lifter-standard-payout',
    timeZone: 'America/Denver',
  })
  public async payoutLifters() {
    this.logger.log('emitting payout');
    this.eventEmitter.emit(EventNames.Payout);
  }

  public async addCronJob(data: CronJobData, createDbObject = true) {
    if (data.options.date < new Date(Date.now())) return;

    const job = new CronJob(data.options.date, () => {
      this[data.cronName](...data.params);
      this.deleteCronJobDescription(data.options.key);
    });

    this.schedulerReg.addCronJob(data.options.key, job);
    job.start();

    if (createDbObject) {
      const cronJob = new CronJobDescription();
      cronJob.key = data.options.key;
      cronJob.data = data;
      await this.cronRepo.save(cronJob);
    }
  }

  public async removeCronJob(cronJobKey: string) {
    try {
      const job = this.schedulerReg.getCronJob(cronJobKey);
      job?.stop();

      this.schedulerReg.deleteCronJob(cronJobKey);
      await this.deleteCronJobDescription(cronJobKey);
    } catch (err) {
      this.logger.warn(
        `Unable to remove cron job with key: ${cronJobKey}. Error: ${err.message}`,
      );
    }
  }

  private async deleteCronJobDescription(key: string) {
    await this.cronRepo.delete({ key: key });
  }

  private async [CronJobNames.AutoClockOut](liftId: string) {
    this.eventEmitter.emit(EventNames.AutoClockOut, new ClockOutEvent(liftId));
  }

  private async [CronJobNames.CustomerPrep](event: CustomerPrepEvent) {
    this.eventEmitter.emit(EventNames.CustomerPrep, event);
  }

  private async [CronJobNames.HighRiskBookingDeletion](
    event: HighRiskBookingDeletionEvent,
  ) {
    this.eventEmitter.emit(EventNames.HighRiskBookingDeletion, event);
  }
}

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CronJobDescription])],
  providers: [CronHelper],
  exports: [CronHelper],
})
export class CronModule {}
