import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Lifter } from './lifters.entity';

@Index('pr_address', ['id'], { unique: true })
@Entity('addresses', { schema: 'public' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'street', length: 128 })
  street: string;

  @Column('character varying', {
    name: 'street_2',
    nullable: true,
    length: 128,
  })
  street2: string | null;

  @Column('character varying', { name: 'city', length: 128 })
  city: string;

  @Column('character varying', { name: 'state', length: 64 })
  state: string;

  @Column('character varying', { name: 'postal_code', length: 32 })
  postalCode: string;

  @OneToOne(() => Booking, (booking) => booking.endingAddress)
  bookingEnd: Booking;

  @OneToOne(() => Booking, (booking) => booking.startingAddress)
  bookingStart: Booking;

  @OneToOne(() => Lifter, (lifters) => lifters.address)
  lifter: Lifter;

  constructor(init?: Partial<Address>) {
    Object.assign(this, init);
  }
}
