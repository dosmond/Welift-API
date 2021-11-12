import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Note } from "./note.entity";

@Index("leads_pkey", ["id"], { unique: true })
@Entity("leads", { schema: "public" })
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("character varying", {
    name: "tt_lead_id",
    nullable: true,
    length: 64,
    default: () => "uuid_generate_v4()",
  })
  ttLeadId: string | null;

  @Column("character varying", { name: "title", nullable: true, length: 256 })
  title: string | null;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 1024,
  })
  description: string | null;

  @Column("character varying", {
    name: "schedule",
    nullable: true,
    length: 128,
  })
  schedule: string | null;

  @Column("character varying", { name: "city", length: 64 })
  city: string;

  @Column("character varying", { name: "state", length: 64 })
  state: string;

  @Column("character varying", { name: "postal_code", length: 32 })
  postalCode: string;

  @Column("character varying", { name: "name", length: 128 })
  name: string;

  @Column("character varying", { name: "phone", nullable: true, length: 32 })
  phone: string | null;

  @Column("character varying", {
    name: "business_name",
    nullable: true,
    length: 128,
  })
  businessName: string | null;

  @Column("character varying", {
    name: "status",
    nullable: true,
    length: 32,
    default: () => "'lead'",
  })
  status: string | null;

  @Column("character varying", { name: "street", nullable: true, length: 128 })
  street: string | null;

  @Column("character varying", {
    name: "street_2",
    nullable: true,
    length: 128,
  })
  street_2: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 128 })
  email: string | null;

  @Column("character varying", {
    name: "referral_code",
    nullable: true,
    length: 64,
  })
  referralCode: string | null;

  @Column("character varying", {
    name: "promo_code",
    nullable: true,
    length: 64,
  })
  promoCode: string | null;

  @Column("date", {
    name: "creation_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  creationDate: string | null;

  @OneToMany(() => Note, (note) => note.lead)
  notes: Note[]
}
