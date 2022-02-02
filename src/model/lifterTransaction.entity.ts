import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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

  @Column('uuid', { name: 'lifter_id' })
  lifterId: string;

  @ManyToOne(() => Lifter, (lifter) => lifter.lifterTransactions)
  @JoinColumn([{ name: 'lifter_id', referencedColumnName: 'id' }])
  lifter: Lifter;

  constructor(init?: Partial<LifterTransaction>) {
    Object.assign(this, init);
  }
}
