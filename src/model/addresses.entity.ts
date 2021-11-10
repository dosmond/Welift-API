import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking.entity";
import { Lifter } from "./lifters.entity";

@Index("pr_address", ["id"], { unique: true })
@Entity("addresses", { schema: "public" })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("character varying", { name: "street", length: 128 })
  street: string;

  @Column("character varying", {
    name: "street_2",
    nullable: true,
    length: 128,
  })
  street_2: string | null;

  @Column("character varying", { name: "city", length: 128 })
  city: string;

  @Column("character varying", { name: "state", length: 64 })
  state: string;

  @Column("character varying", { name: "postal_code", length: 32 })
  postalCode: string;

  @OneToMany(() => Booking, (booking) => booking.endingAddress)
  bookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.startingAddress)
  bookings2: Booking[];

  @OneToMany(() => Lifter, (lifters) => lifters.address2)
  lifters: Lifter[];
}
