import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('partner_referrals_pkey', ['id'], { unique: true })
@Entity('partner_referrals', { schema: 'public' })
export class PartnerReferral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'partner_id' })
  partnerId: string;

  @Column('uuid', { name: 'booking_id' })
  bookingId: string;

  @Column('boolean', { name: 'refunded', default: () => 'false' })
  refunded: boolean;

  constructor(init?: Partial<PartnerReferral>) {
    Object.assign(this, init);
  }
}
