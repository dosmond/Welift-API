import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lifter } from './lifters.entity';

@Index('fki_fk_lifter_stats_id', ['lifterId'], {})
@Entity('lifter_stats', { schema: 'public' })
export class LifterStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'lifter_id' })
  lifterId: string;

  @Column('integer', { name: 'completed_moves', default: 0 })
  completedMoves: number;

  @Column('double precision', {
    name: 'total_earned_money',
    default: () => '0.0',
  })
  totalEarnedMoney: number;

  @ManyToOne(() => Lifter, (lifters) => lifters.lifterStats)
  @JoinColumn([{ name: 'lifter_id', referencedColumnName: 'id' }])
  lifter: Lifter;

  constructor(init?: Partial<LifterStats>) {
    Object.assign(this, init);
  }
}
