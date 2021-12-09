import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pr_pending', ['id'], { unique: true })
@Index('user_key', ['user'], { unique: true })
@Entity('pending_verification', { schema: 'public' })
export class PendingVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'user', length: 128 })
  user: string;

  @Column('character varying', {
    name: 'code',
    length: 6,
  })
  code: string;
}
