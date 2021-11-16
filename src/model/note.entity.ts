import { Lead } from './leads.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Lifter } from './lifters.entity';

@Index('pr_note', ['id'], { unique: true })
@Entity('notes', { schema: 'public' })
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'street', length: 128 })
  street: string;

  @Column('uuid', { name: 'lead_id' })
  leadId: string;

  @Column('uuid', { name: 'booking_id' })
  bookingId: string;

  @Column('character varying', {
    name: 'note',
    nullable: false,
    length: 1024,
  })
  note: string;

  @Column('character varying', {
    name: 'author',
    nullable: false,
    length: 256,
  })
  author: string;

  @ManyToOne(() => Booking, (booking) => booking.notes)
  @JoinColumn([{ name: 'booking_id', referencedColumnName: 'id' }])
  booking: Booking;

  @ManyToOne(() => Lead, (lead) => lead.notes)
  @JoinColumn([{ name: 'lead_id', referencedColumnName: 'id' }])
  lead: Lead;
}
