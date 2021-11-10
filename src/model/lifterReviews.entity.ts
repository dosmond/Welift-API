import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lifter } from "./lifters.entity";

@Index("lifter_reviews_pkey", ["id"], { unique: true })
@Index("fki_fk_lifter_review_lifter_id", ["lifterId"], {})
@Entity("lifter_reviews", { schema: "public" })
export class LifterReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("uuid", { name: "lifter_id" })
  lifterId: string;

  @Column("character varying", { name: "content", nullable: true, length: 512 })
  content: string | null;

  @Column("integer", { name: "rating" })
  rating: number;

  @ManyToOne(() => Lifter, (lifters) => lifters.lifterReviews)
  @JoinColumn([{ name: "lifter_id", referencedColumnName: "id" }])
  lifter: Lifter;
}
