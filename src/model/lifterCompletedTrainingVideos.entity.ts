import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TrainingVideo } from './TrainingVideos.entity';
import { Lifter } from './lifters.entity';

@Index('lifter_completed_training_videos_pkey', ['id'], { unique: true })
@Index('fki_fk_lifter_id_completed_videos', ['lifterId'], {})
@Index('unique_lifter_video', ['lifterId', 'videoId'], { unique: true })
@Index('fki_fk_video_id', ['videoId'], {})
@Unique('uq_lifterId_videoId', ['lifterId', 'videoId'])
@Entity('lifter_completed_training_videos', { schema: 'public' })
export class LifterCompletedTrainingVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'lifter_id' })
  lifterId: string;

  @Column('uuid', { name: 'video_id' })
  videoId: string;

  @ManyToOne(
    () => TrainingVideo,
    (trainingVideos) => trainingVideos.lifterCompletedTrainingVideos,
  )
  @JoinColumn([{ name: 'video_id', referencedColumnName: 'id' }])
  video: TrainingVideo;

  @ManyToOne(() => Lifter, (lifters) => lifters.lifterCompletedTrainingVideos)
  @JoinColumn([{ name: 'lifter_id', referencedColumnName: 'id' }])
  lifter: Lifter;

  constructor(init?: Partial<LifterCompletedTrainingVideo>) {
    Object.assign(this, init);
  }
}
