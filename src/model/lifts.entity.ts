import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AcceptedLift } from './acceptedLift.entity';
import { Booking } from './booking.entity';

@Index('uq_booking_id', ['bookingId'], { unique: true })
@Index('fki_fk_booking_id', ['bookingId'], {})
@Index('lifts_pkey', ['id'], { unique: true })
@Entity('lifts', { schema: 'public' })
export class Lift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'booking_id', unique: true })
  bookingId: string;

  @Column('integer', { name: 'current_lifter_count', default: 0 })
  currentLifterCount: number;

  @Column('character varying', { name: 'completion_token', length: 6 })
  completionToken: string;

  @Column('character varying', {
    name: 'lift_status',
    nullable: true,
    length: 32,
    default: () => "'not started'",
  })
  liftStatus: string | null;

  @Column('boolean', { name: 'has_pickup_truck', default: () => 'false' })
  hasPickupTruck: boolean;

  @OneToMany(() => AcceptedLift, (acceptedLifts) => acceptedLifts.lift)
  acceptedLifts: AcceptedLift[];

  @OneToOne(() => Booking, (booking) => booking.lift)
  @JoinColumn([{ name: 'booking_id', referencedColumnName: 'id' }])
  booking: Booking;
}
