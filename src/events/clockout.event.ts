import { IsUUID } from 'class-validator';

export class ClockOutEvent {
  @IsUUID()
  liftId: string;

  constructor(liftId: string) {
    this.liftId = liftId;
  }
}
