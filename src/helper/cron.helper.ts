import { Type } from 'class-transformer';
import { CronJobNames } from './../enum/cronJobNames.enum';
import { EventNames } from './../enum/eventNames.enum';
import { ClockOutEvent } from './../events/clockout.event';
import { CronJobDescription } from './../model/cronjob.entity';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IsDate,
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

export class CronJobOptions {
  @IsString()
  key: string;

  @IsDate()
  date: Date;

  constructor(init?: Partial<CronJobOptions>) {
    Object.assign(this, init);
  }
}

export class CronJobData {
  @IsString()
  cronName: string;

  @IsOptional()
  @IsArray()
  params: any[];

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CronJobOptions)
  options: CronJobOptions;

  constructor(init?: Partial<CronJobData>) {
    Object.assign(this, init);
  }
}

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

  public async addCronJob(data: CronJobData) {
    const job = new CronJob(data.options.date, () => {
      this[data.cronName](...data.params);
      this.deleteCronJobDescription(data.options.key);
    });

    this.schedulerReg.addCronJob(data.options.key, job);
    job.start();

    const cronJob = new CronJobDescription();
    cronJob.key = data.options.key;
    cronJob.data = data;
    await this.cronRepo.save(cronJob);
  }

  public async deleteCronJobDescription(key: string) {
    await this.cronRepo.delete({ key: key });
  }

  private async [CronJobNames.AutoClockOut](liftId: string) {
    console.log('emitting autoclockout');
    this.eventEmitter.emit(EventNames.AutoClockOut, new ClockOutEvent(liftId));
  }
}
