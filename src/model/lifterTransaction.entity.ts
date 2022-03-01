import { AcceptedLift } from '@src/model/acceptedLift.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lifter } from './lifters.entity';

@Index('pr_lifter_transaction', ['id'], { unique: true })
@Index('fki_fk_transaction_lifter_id', ['lifterId'], {})
@Entity('lifter_transaction', { schema: 'public' })
export class LifterTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'title', length: 128 })
  title: string;

  @Column('timestamptz', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column('double precision', { name: 'remaining_balance' })
  remainingBalance: number;

  @Column('double precision', { name: 'amount' })
  amount: number;

  @Column('double precision', { name: 'fees', default: 0.0 })
  fees: number;

  @Column('boolean', { name: 'is_quick_deposit', default: false })
  isQuickDeposit: boolean;

  @Column('boolean', { name: 'is_referral', default: false })
  isReferral: boolean;

  @Column('uuid', { name: 'lifter_id' })
  lifterId: string;

  @Column('uuid', { name: 'accepted_lift_id', nullable: true })
  acceptedLiftId: string | null;

  @ManyToOne(() => Lifter, (lifter) => lifter.lifterTransactions)
  @JoinColumn([{ name: 'lifter_id', referencedColumnName: 'id' }])
  lifter: Lifter;

  @OneToOne(() => AcceptedLift, (acceptedLift) => acceptedLift.transaction)
  @JoinColumn([{ name: 'accepted_lift_id', referencedColumnName: 'id' }])
  acceptedLift: AcceptedLift;

  constructor(init?: Partial<LifterTransaction>) {
    Object.assign(this, init);
  }
}
