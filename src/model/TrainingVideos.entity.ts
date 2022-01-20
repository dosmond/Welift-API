import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LifterCompletedTrainingVideo } from './lifterCompletedTrainingVideos.entity';

@Index('training_videos_pkey', ['id'], { unique: true })
@Entity('training_videos', { schema: 'public' })
export class TrainingVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name', length: 128 })
  name: string;

  @OneToMany(
    () => LifterCompletedTrainingVideo,
    (lifterCompletedTrainingVideos) => lifterCompletedTrainingVideos.video,
  )
  lifterCompletedTrainingVideos: LifterCompletedTrainingVideo[];

  constructor(init?: Partial<TrainingVideo>) {
    Object.assign(this, init);
  }
}
