import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Lift } from "./lifts.entity";
import { Lifter } from "./lifters.entity";

@Index("pk_accepted_lifts", ["id"], { unique: true })
@Index("fki_fk_lift_id", ["liftId"], {})
@Unique("uq_lifter_lift", ["liftId", "lifterId"],)
@Index("fki_fk_accepted_lift_lifter_id", ["lifterId"], {})
@Entity("accepted_lifts", { schema: "public" })
export class AcceptedLift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("uuid", { name: "lifter_id" })
  lifterId: string;

  @Column("timestamp with time zone", { name: "clock_in_time", nullable: true })
  clockInTime: Date | null;

  @Column("timestamp with time zone", {
    name: "clock_out_time",
    nullable: true,
  })
  clockOutTime: Date | null;

  @Column("uuid", { name: "lift_id" })
  liftId: string;

  @Column("double precision", {
    name: "payrate",
    default: () => "20.0",
  })
  payrate: number;

  @Column("boolean", { name: "use_pickup_truck", default: () => "false" })
  usePickupTruck: boolean;

  @ManyToOne(() => Lift, (lifts) => lifts.acceptedLifts)
  @JoinColumn([{ name: "lift_id", referencedColumnName: "id" }])
  lift: Lift;

  @ManyToOne(() => Lifter, (lifters) => lifters.acceptedLifts)
  @JoinColumn([{ name: "lifter_id", referencedColumnName: "id" }])
  lifter: Lifter;
}
