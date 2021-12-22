import { SchedulerRegistry } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CronHelper {
  constructor(private schedulerReg: SchedulerRegistry) {}
}
