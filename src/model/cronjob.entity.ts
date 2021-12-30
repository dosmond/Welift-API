import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('pk_cron_job', ['id'], { unique: true })
@Entity('cron_job_description', { schema: 'public' })
export class CronJobDescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name', length: 256 })
  key: string;

  @Column('json')
  data: any;
}
