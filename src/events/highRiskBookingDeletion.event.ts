import { Booking } from './../model/booking.entity';
import { IsString, IsUUID, IsObject } from 'class-validator';

export class HighRiskBookingDeletionEvent {
  @IsObject()
  booking: Booking;

  @IsUUID()
  liftId: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  state: string;

  @IsString()
  eventId: string;

  constructor(init?: Partial<HighRiskBookingDeletionEvent>) {
    Object.assign(this, init);
  }
}
