import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AcceptedLift } from './acceptedLift.entity';
import { CompletedLifterBadge } from './completedLifterBadges.entity';
import { LifterCompletedTrainingVideo } from './lifterCompletedTrainingVideos.entity';
import { LifterEquipment } from './lifterEquipment.entity';
import { LifterReview } from './lifterReviews.entity';
import { LifterStats } from './lifterStats.entity';
import { Address } from './addresses.entity';

@Index('fki_fk_lifter_address', ['address'], {})
@Index('lifters_email_phone_key', ['email', 'phone'], { unique: true })
@Index('lifters_email_key', ['email'], { unique: true })
@Index('pr_lifters', ['id'], { unique: true })
@Index('lifters_phone_key', ['phone'], { unique: true })
@Index('lifters_user_id_key', ['userId'], { unique: true })
@Entity('lifters', { schema: 'public' })
export class Lifter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'first_name', length: 64 })
  firstName: string;

  @Column('character varying', { name: 'last_name', length: 64 })
  lastName: string;

  @Column('character varying', { name: 'alias', length: 128, nullable: true })
  alias: string;

  @Column('uuid', { name: 'address' })
  addressId: string;

  @Column('boolean', { name: 'passed_bc', default: () => 'false' })
  passedBc: boolean;

  @Column('character varying', { name: 'email', length: 128 })
  email: string;

  @Column('character varying', { name: 'phone', length: 32 })
  phone: string;

  @Column('character varying', {
    name: 'expected_frequency',
    nullable: true,
    length: 128,
  })
  expectedFrequency: string | null;

  @Column('boolean', { name: 'has_pickup_truck', default: () => 'false' })
  hasPickupTruck: boolean;

  @Column('integer', { name: 'lifter_rating', default: 0 })
  lifterRating: number;

  @Column('character varying', { name: 'status', length: 128 })
  status: string;

  @Column('character varying', { name: 'avatar', nullable: true, length: 1024 })
  avatar: string | null;

  @Column('boolean', { name: 'accepted_contract', nullable: true })
  acceptedContract: boolean | null;

  @Column('uuid', { name: 'user_id', nullable: true, unique: true })
  userId: string | null;

  @Column('character varying', {
    name: 'location',
    nullable: true,
    length: 256,
    default: () => "'Interim'",
  })
  location: string | null;

  @Column('integer', { name: 'current_bonus', default: 0 })
  currentBonus: number;

  @Column('date', {
    name: 'creation_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate: Date | null;

  @Column('boolean', {
    name: 'bc_in_progress',
    nullable: true,
    default: false,
  })
  bcInProgress: boolean | null;

  @Column('boolean', {
    name: 'deletion_pending',
    default: false,
  })
  deletionPending: boolean | null;

  @Column('timestamp', {
    name: 'latest_open',
    default: () => 'CURRENT_TIMESTAMP',
  })
  latestOpen: Date;

  @Column('character varying', {
    name: 'checkr_id',
    nullable: true,
    length: 1024,
  })
  checkrId: string | null;

  @OneToMany(() => AcceptedLift, (acceptedLift) => acceptedLift.lifter)
  acceptedLifts: AcceptedLift[];

  @OneToMany(
    () => CompletedLifterBadge,
    (completedLifterBadges) => completedLifterBadges.lifter,
  )
  completedLifterBadges: CompletedLifterBadge[];

  @OneToMany(
    () => LifterCompletedTrainingVideo,
    (lifterCompletedTrainingVideos) => lifterCompletedTrainingVideos.lifter,
  )
  lifterCompletedTrainingVideos: LifterCompletedTrainingVideo[];

  @OneToMany(() => LifterEquipment, (lifterEquipment) => lifterEquipment.lifter)
  lifterEquipments: LifterEquipment[];

  @OneToMany(() => LifterReview, (lifterReviews) => lifterReviews.lifter)
  lifterReviews: LifterReview[];

  @OneToOne(() => LifterStats, (lifterStats) => lifterStats.lifter)
  lifterStats: LifterStats;

  @OneToOne(() => Address, (addresses) => addresses.lifter, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'address', referencedColumnName: 'id' }])
  address: Address;

  constructor(init?: Partial<Lifter>) {
    Object.assign(this, init);
  }
}
