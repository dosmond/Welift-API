import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './addresses.entity';
import { Lift } from './lifts.entity';
import { Note } from './note.entity';

@Index('fki_fk_ending_address', ['endingAddress'], {})
@Index('pr_booking', ['id'], { unique: true })
@Index('fki_fk_starting_address', ['startingAddress'], {})
@Entity('booking', { schema: 'public' })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { name: 'needs_pickup_truck' })
  needsPickupTruck: boolean;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('character varying', { name: 'phone', length: 13 })
  phone: string;

  @Column('character varying', { name: 'email', nullable: true, length: 128 })
  email: string | null;

  @Column('character varying', { name: 'distance_info', length: 128 })
  distanceInfo: string;

  @Column('character varying', {
    name: 'additional_info',
    nullable: true,
    length: 512,
  })
  additionalInfo: string | null;

  @Column('character varying', {
    name: 'special_items',
    nullable: true,
    length: 512,
  })
  specialItems: string | null;

  @Column('uuid', { name: 'starting_address' })
  startingAddressId: string;

  @Column('uuid', { name: 'ending_address', nullable: true })
  endingAddressId: string | null;

  @Column('timestamp with time zone', { name: 'start_time' })
  startTime: Date;

  @Column('integer', { name: 'lifter_count' })
  lifterCount: number;

  @Column('integer', { name: 'hours_count' })
  hoursCount: number;

  @Column('double precision', {
    name: 'total_cost',
    default: () => '0.0',
  })
  totalCost: number;

  @Column('timestamptz', {
    name: 'creation_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate: Date;

  @Column('character varying', {
    name: 'stripe_session_id',
    nullable: true,
    length: 256,
  })
  stripeSessionId: string | null;

  @Column('timestamp with time zone', { name: 'end_time' })
  endTime: Date;

  @Column('character varying', {
    name: 'referral_code',
    nullable: true,
    length: 64,
    default: () => 'generate_random_referral()',
  })
  referralCode: string | null;

  @Column('character varying', {
    name: 'status',
    nullable: true,
    length: 64,
    default: () => "'email sent'",
  })
  status: string | null;

  @Column('character varying', {
    name: 'timezone',
    nullable: true,
    length: 64,
    default: () => "'Mountain Daylight Time'",
  })
  timezone: string | null;

  @Column('character varying', {
    name: 'calendar_event_id',
    nullable: true,
    length: 256,
  })
  calendarEventId: string | null;

  @Column('character varying', {
    name: 'acquisition_channel',
    nullable: true,
    length: 128,
  })
  acquisitionChannel: string | null;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 1024,
  })
  description: string | null;

  @Column('boolean', { name: 'is_high_risk', default: false })
  isHighRisk: boolean;

  @OneToOne(() => Address, (addresses) => addresses.bookingEnd)
  @JoinColumn([{ name: 'ending_address', referencedColumnName: 'id' }])
  endingAddress: Address;

  @OneToOne(() => Address, (addresses) => addresses.bookingStart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'starting_address', referencedColumnName: 'id' }])
  startingAddress: Address;

  @OneToMany(() => Note, (note) => note.booking)
  notes: Note[];

  @OneToOne(() => Lift, (lift) => lift.booking)
  lift: Lift;

  constructor(init?: Partial<Booking>) {
    Object.assign(this, init);
  }
}
