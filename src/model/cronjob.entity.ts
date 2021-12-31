import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsOptional,
  IsArray,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export class CronJobOptions {
  @IsString()
  key: string;

  @IsDate()
  date: Date;

  constructor(init?: Partial<CronJobOptions>) {
    Object.assign(this, init);
  }
}

export class CronJobData {
  @IsString()
  cronName: string;

  @IsOptional()
  @IsArray()
  params: any[];

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CronJobOptions)
  options: CronJobOptions;

  constructor(init?: Partial<CronJobData>) {
    Object.assign(this, init);
  }
}

@Index('pk_cron_job', ['id'], { unique: true })
@Entity('cron_job_description', { schema: 'public' })
export class CronJobDescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'key', length: 256 })
  key: string;

  @Column('json')
  data: CronJobData;
}
