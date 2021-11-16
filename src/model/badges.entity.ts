import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompletedLifterBadge } from './completedLifterBadges.entity';

@Index('pk_badges', ['id'], { unique: true })
@Entity('badges', { schema: 'public' })
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name', length: 128 })
  name: string;

  @Column('integer', { name: 'required_value', default: () => '0' })
  requiredValue: number;

  @OneToMany(
    () => CompletedLifterBadge,
    (completedLifterBadges) => completedLifterBadges.badge,
  )
  completedLifterBadges: CompletedLifterBadge[];
}
