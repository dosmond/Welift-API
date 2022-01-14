import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Badge } from './badges.entity';
import { Lifter } from './lifters.entity';

@Index('fki_fk_badge_id', ['badgeId'], {})
@Index('pk_completed_lifter_badge', ['id'], { unique: true })
@Index('fki_fk_lifter_id_to_badge', ['lifterId'], {})
@Unique('uq_badge_id_lifter_id', ['badgeId', 'lifterId'])
@Entity('completed_lifter_badges', { schema: 'public' })
export class CompletedLifterBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'lifter_id' })
  lifterId: string;

  @Column('uuid', { name: 'badge_id' })
  badgeId: string;

  @ManyToOne(() => Badge, (badges) => badges.completedLifterBadges)
  @JoinColumn([{ name: 'badge_id', referencedColumnName: 'id' }])
  badge: Badge;

  @ManyToOne(() => Lifter, (lifters) => lifters.completedLifterBadges)
  @JoinColumn([{ name: 'lifter_id', referencedColumnName: 'id' }])
  lifter: Lifter;

  constructor(init?: Partial<CompletedLifterBadge>) {
    Object.assign(this, init);
  }
}
