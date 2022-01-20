import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Index('pk_booking_location_count', ['id'], { unique: true })
@Unique('uq_state', ['state'])
@Entity('booking_location_count', { schema: 'public' })
export class BookingLocationCount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    name: 'state',
    length: 128,
  })
  state: string;

  @Column('integer', { name: 'count', default: 0 })
  count: number;

  constructor(init?: Partial<BookingLocationCount>) {
    Object.assign(this, init);
  }
}
