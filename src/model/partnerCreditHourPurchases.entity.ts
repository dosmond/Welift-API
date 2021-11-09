import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Partners } from "./Partners.entity";

@Index("partner_credit_hour_purchases_pkey", ["id"], { unique: true })
@Index("fki_fk_credit_purchase_partner_id", ["partnerId"], {})
@Index(
  "partner_credit_hour_purchases_stripe_session_id_key",
  ["stripeSessionId"],
  { unique: true }
)
@Entity("partner_credit_hour_purchases", { schema: "public" })
export class PartnerCreditHourPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("character varying", {
    name: "stripe_session_id",
    unique: true,
    length: 1024,
  })
  stripeSessionId: string;

  @Column("integer", { name: "credits_purchased" })
  creditsPurchased: number;

  @Column("integer", { name: "total_cost" })
  totalCost: number;

  @Column("uuid", { name: "partner_id", nullable: true })
  partnerId: string | null;

  @Column("timestamp with time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  creationDate: Date;

  @ManyToOne(() => Partners, (partners) => partners.partnerCreditHourPurchases)
  @JoinColumn([{ name: "partner_id", referencedColumnName: "id" }])
  partner: Partners;
}
