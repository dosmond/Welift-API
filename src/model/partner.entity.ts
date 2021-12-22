import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartnerCreditHourPurchase } from './partnerCreditHourPurchases.entity';

@Index('uq_partner_email', ['email'], { unique: true })
@Index('partners_pkey', ['id'], { unique: true })
@Entity('partners', { schema: 'public' })
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'company_name', length: 256 })
  companyName: string;

  @Column('character varying', { name: 'email', unique: true, length: 256 })
  email: string;

  @Column('integer', { name: 'total_credits', default: () => '0' })
  totalCredits: number;

  @Column('character varying', { name: 'phone', length: 32 })
  phone: string;

  @Column('character varying', { name: 'logo', nullable: true, length: 2048 })
  logo: string | null;

  @Column('character varying', {
    name: 'referral_code',
    nullable: true,
    length: 10,
    default: () => 'generate_random_referral_2()',
  })
  referralCode: string | null;

  @Column('date', {
    name: 'creation_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate: Date | null;

  @OneToMany(
    () => PartnerCreditHourPurchase,
    (partnerCreditHourPurchases) => partnerCreditHourPurchases.partner,
  )
  partnerCreditHourPurchases: PartnerCreditHourPurchase[];
}
