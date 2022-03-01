import { IsUUID } from 'class-validator';

export class HighRiskBookingDeletionCancellationEvent {
  @IsUUID()
  liftId: string;

  constructor(init?: Partial<HighRiskBookingDeletionCancellationEvent>) {
    Object.assign(this, init);
  }
}
