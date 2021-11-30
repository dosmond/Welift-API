import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pr_wiw_lifter', ['id'], { unique: true })
@Entity('wiw_lifters', { schema: 'public' })
export class WiwLifters {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    name: 'name',
    nullable: true,
    length: 1024,
  })
  name: string;

  @Column('character varying', {
    name: 'email',
    nullable: true,
    length: 1024,
  })
  email: string;

  @Column('character varying', {
    name: 'phone',
    nullable: true,
    length: 1024,
  })
  phone: string;

  @Column('character varying', {
    name: 'location',
    nullable: true,
    length: 1024,
  })
  location: string;
}
