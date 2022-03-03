import { IsUUID, IsString } from 'class-validator';

export class LifterClockInReminderEvent {
  @IsUUID()
  acceptedLiftId: string;

  @IsString()
  city: string;

  constructor(init?: Partial<LifterClockInReminderEvent>) {
    Object.assign(this, init);
  }
}
