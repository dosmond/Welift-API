import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Badge } from "./badges.entity";
import { Lifters } from "./lifters.entity";

@Index("Unique_row", ["badgeId", "lifterId"], { unique: true })
@Index("fki_fk_badge_id", ["badgeId"], {})
@Index("pk_completed_lifter_badge", ["id"], { unique: true })
@Index("fki_fk_lifter_id_to_badge", ["lifterId"], {})
@Entity("completed_lifter_badges", { schema: "public" })
export class CompletedLifterBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("uuid", { name: "lifter_id", unique: true })
  lifterId: string;

  @Column("uuid", { name: "badge_id", unique: true })
  badgeId: string;

  @ManyToOne(() => Badge, (badges) => badges.completedLifterBadges)
  @JoinColumn([{ name: "badge_id", referencedColumnName: "id" }])
  badge: Badge;

  @ManyToOne(() => Lifters, (lifters) => lifters.completedLifterBadges)
  @JoinColumn([{ name: "lifter_id", referencedColumnName: "id" }])
  lifter: Lifters;
}
