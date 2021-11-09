import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TrainingVideo } from "./TrainingVideos.entity";
import { Lifters } from "./lifters.entity";

@Index("lifter_completed_training_videos_pkey", ["id"], { unique: true })
@Index("fki_fk_lifter_id_completed_videos", ["lifterId"], {})
@Index("unique_lifter_video", ["lifterId", "videoId"], { unique: true })
@Index("fki_fk_video_id", ["videoId"], {})
@Entity("lifter_completed_training_videos", { schema: "public" })
export class LifterCompletedTrainingVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("uuid", { name: "lifter_id", unique: true })
  lifterId: string;

  @Column("uuid", { name: "video_id", unique: true })
  videoId: string;

  @ManyToOne(
    () => TrainingVideo,
    (trainingVideos) => trainingVideos.lifterCompletedTrainingVideos
  )
  @JoinColumn([{ name: "video_id", referencedColumnName: "id" }])
  video: TrainingVideo;

  @ManyToOne(() => Lifters, (lifters) => lifters.lifterCompletedTrainingVideos)
  @JoinColumn([{ name: "lifter_id", referencedColumnName: "id" }])
  lifter: Lifters;
}
