import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1636497287917 implements MigrationInterface {
  name = 'init1636497287917';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create function generate_random_referral()
    returns text
    language plpgsql
   as
 $$
 BEGIN
   RETURN LOWER(SUBSTRING(MD5(uuid_generate_v4()::TEXT) FOR 8));
 END;
 $$;
 
 create function generate_random_referral_2()
    returns text
    language plpgsql
   as
 $$
 BEGIN
   RETURN LOWER(SUBSTRING(MD5(uuid_generate_v4()::TEXT) FOR 10));
 END;
 $$;`);
    await queryRunner.query(
      `CREATE TABLE "badges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "required_value" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_8a651318b8de577e8e217676466" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_badges" ON "badges" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "completed_lifter_badges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lifter_id" uuid NOT NULL, "badge_id" uuid NOT NULL, CONSTRAINT "UQ_89aa7842a1a3a0260e6189e455b" UNIQUE ("lifter_id"), CONSTRAINT "UQ_4d03fa9453d9514ea92081d0159" UNIQUE ("badge_id"), CONSTRAINT "PK_b1f816eb74453ff425695a0b812" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_lifter_id_to_badge" ON "completed_lifter_badges" ("lifter_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_completed_lifter_badge" ON "completed_lifter_badges" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_badge_id" ON "completed_lifter_badges" ("badge_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "Unique_row" ON "completed_lifter_badges" ("badge_id", "lifter_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "training_videos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, CONSTRAINT "PK_567d0937a5abeabe7f75bdc95c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "training_videos_pkey" ON "training_videos" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lifter_completed_training_videos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lifter_id" uuid NOT NULL, "video_id" uuid NOT NULL, CONSTRAINT "UQ_7117f103c70f43c194f65026fa8" UNIQUE ("lifter_id"), CONSTRAINT "UQ_bf8a45708809089440cd818730d" UNIQUE ("video_id"), CONSTRAINT "PK_4b2d49aed5df3853619d3c16d43" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_video_id" ON "lifter_completed_training_videos" ("video_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_lifter_video" ON "lifter_completed_training_videos" ("lifter_id", "video_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_lifter_id_completed_videos" ON "lifter_completed_training_videos" ("lifter_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifter_completed_training_videos_pkey" ON "lifter_completed_training_videos" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "equipment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "equipment_pkey" ON "equipment" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lifter_equipment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lifter_id" uuid NOT NULL, "equipment_id" uuid NOT NULL, CONSTRAINT "UQ_7c156a73a89976836f7f93e4801" UNIQUE ("lifter_id"), CONSTRAINT "UQ_563aed57adf515c0b22bc32f9df" UNIQUE ("equipment_id"), CONSTRAINT "PK_aa8bf7cc338b2d56c5f2c2cd1c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_lifter_id" ON "lifter_equipment" ("lifter_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_lifter_equipment" ON "lifter_equipment" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifter_equipment_lifter_id_equipment_id_key" ON "lifter_equipment" ("equipment_id", "lifter_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_equipment_id" ON "lifter_equipment" ("equipment_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lifter_reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lifter_id" uuid NOT NULL, "content" character varying(512), "rating" integer NOT NULL, CONSTRAINT "PK_eaa01768ed2c1a140ab8ba464af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_lifter_review_lifter_id" ON "lifter_reviews" ("lifter_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifter_reviews_pkey" ON "lifter_reviews" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lifter_stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lifter_id" uuid NOT NULL, "completed_moves" integer NOT NULL DEFAULT 0, "total_earned_money" double precision NOT NULL DEFAULT 0.0, CONSTRAINT "PK_21c4232f31199c68041109535ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_lifter_stats_id" ON "lifter_stats" ("lifter_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lifters" ("first_name" character varying(64) NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "last_name" character varying(64) NOT NULL, "address" uuid NOT NULL, "passed_bc" boolean NOT NULL DEFAULT false, "email" character varying(128) NOT NULL, "phone" character varying(32) NOT NULL, "expected_frequency" character varying(128), "has_pickup_truck" boolean NOT NULL DEFAULT false, "lifter_rating" integer NOT NULL DEFAULT 0, "status" character varying(128) NOT NULL, "avatar" character varying(1024), "accepted_contract" boolean, "user_id" uuid, "location" character varying(256) DEFAULT 'Interim', "current_bonus" integer NOT NULL DEFAULT 0, "creation_date" date DEFAULT now(), "bc_in_progress" boolean DEFAULT false, CONSTRAINT "UQ_e3e2af04662ecba041681171f8d" UNIQUE ("user_id"), CONSTRAINT "PK_7b53a11ccc87b35afd4ccaccb6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifters_user_id_key" ON "lifters" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifters_phone_key" ON "lifters" ("phone") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pr_lifters" ON "lifters" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifters_email_key" ON "lifters" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifters_email_phone_key" ON "lifters" ("email", "phone") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_lifter_address" ON "lifters" ("address") `,
    );
    await queryRunner.query(
      `CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying(128) NOT NULL, "street_2" character varying(128), "city" character varying(128) NOT NULL, "state" character varying(64) NOT NULL, "postal_code" character varying(32) NOT NULL, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pr_address" ON "addresses" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("needs_pickup_truck" boolean NOT NULL, "name" character varying(50) NOT NULL, "phone" character varying(13) NOT NULL, "email" character varying(128), "distance_info" character varying(128) NOT NULL, "additional_info" character varying(512), "special_items" character varying(512), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "starting_address" uuid NOT NULL, "ending_address" uuid, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "lifter_count" integer NOT NULL, "hours_count" integer NOT NULL, "total_cost" double precision NOT NULL DEFAULT 0.0, "creation_date" date DEFAULT now(), "stripe_session_id" character varying(256), "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "referral_code" character varying(64) DEFAULT generate_random_referral(), "status" character varying(64) DEFAULT 'email sent', "timezone" character varying(64) DEFAULT 'Mountain Daylight Time', CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_starting_address" ON "booking" ("starting_address") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pr_booking" ON "booking" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_ending_address" ON "booking" ("ending_address") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "booking_id" uuid NOT NULL, "current_lifter_count" integer NOT NULL DEFAULT 0, "completion_token" character varying(6) NOT NULL, "lift_status" character varying(32) DEFAULT 'not started', "has_pickup_truck" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_1961ed9e51a9c1cefc0775badc1" UNIQUE ("booking_id"), CONSTRAINT "REL_1961ed9e51a9c1cefc0775badc" UNIQUE ("booking_id"), CONSTRAINT "PK_e5b7f1186f8fec4ac1f4b854000" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifts_pkey" ON "lifts" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_booking_id" ON "lifts" ("booking_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_booking_id" ON "lifts" ("booking_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "accepted_lifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lifter_id" uuid NOT NULL, "clock_in_time" TIMESTAMP WITH TIME ZONE, "clock_out_time" TIMESTAMP WITH TIME ZONE, "lift_id" uuid NOT NULL, "payrate" double precision NOT NULL DEFAULT 20.0, "use_pickup_truck" boolean NOT NULL DEFAULT false, CONSTRAINT "uq_lifter_lift" UNIQUE ("lift_id", "lifter_id"), CONSTRAINT "PK_da3c4673978d45d1948343cca00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_accepted_lift_lifter_id" ON "accepted_lifts" ("lifter_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_lift_id" ON "accepted_lifts" ("lift_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_accepted_lifts" ON "accepted_lifts" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "leads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tt_lead_id" character varying(64) DEFAULT uuid_generate_v4(), "title" character varying(256), "description" character varying(1024), "schedule" character varying(128), "city" character varying(64) NOT NULL, "state" character varying(64) NOT NULL, "postal_code" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, "phone" character varying(32), "business_name" character varying(128), "status" character varying(32) DEFAULT 'lead', "street" character varying(128), "street_2" character varying(128), "email" character varying(128), "referral_code" character varying(64), "promo_code" character varying(64), "creation_date" date DEFAULT now(), CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "leads_pkey" ON "leads" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "partners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "company_name" character varying(256) NOT NULL, "email" character varying(256) NOT NULL, "total_credits" integer NOT NULL DEFAULT 0, "phone" character varying(32) NOT NULL, "logo" character varying(2048), "referral_code" character varying(10) DEFAULT generate_random_referral_2(), CONSTRAINT "UQ_6b39bc13ab676e74eada2e744db" UNIQUE ("email"), CONSTRAINT "PK_998645b20820e4ab99aeae03b41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "partners_pkey" ON "partners" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_partner_email" ON "partners" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "partner_credit_hour_purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stripe_session_id" character varying(1024) NOT NULL, "credits_purchased" integer NOT NULL, "total_cost" integer NOT NULL, "partner_id" uuid, "creation_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_46f23da93ff2d174efe6d3b0f0b" UNIQUE ("stripe_session_id"), CONSTRAINT "PK_125461f07454e0ea9d7d9ae25f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "partner_credit_hour_purchases_stripe_session_id_key" ON "partner_credit_hour_purchases" ("stripe_session_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_credit_purchase_partner_id" ON "partner_credit_hour_purchases" ("partner_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "partner_credit_hour_purchases_pkey" ON "partner_credit_hour_purchases" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "partner_referrals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "partner_id" uuid NOT NULL, "booking_id" uuid NOT NULL, "refunded" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_57af19f6790f3bfa9ea351f10b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "partner_referrals_pkey" ON "partner_referrals" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "FK_4d03fa9453d9514ea92081d0159" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "FK_89aa7842a1a3a0260e6189e455b" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "FK_bf8a45708809089440cd818730d" FOREIGN KEY ("video_id") REFERENCES "training_videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "FK_7117f103c70f43c194f65026fa8" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "FK_563aed57adf515c0b22bc32f9df" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "FK_7c156a73a89976836f7f93e4801" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_reviews" ADD CONSTRAINT "FK_95e90f6de1b98f28946e413e173" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_stats" ADD CONSTRAINT "FK_7cfb6bc3964fdc0b7f7bfbb5794" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD CONSTRAINT "FK_d72ceaccef5bba1247042358bde" FOREIGN KEY ("address") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_6a53cae74754a238e32ba515c41" FOREIGN KEY ("ending_address") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_132af5cf621724a4dcd5220ad65" FOREIGN KEY ("starting_address") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" ADD CONSTRAINT "FK_1961ed9e51a9c1cefc0775badc1" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" ADD CONSTRAINT "FK_ae98ecb9b823cd83099ac2c8c19" FOREIGN KEY ("lift_id") REFERENCES "lifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" ADD CONSTRAINT "FK_fbbd09452b5a854ffce9309c3bf" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_credit_hour_purchases" ADD CONSTRAINT "FK_fe081260519cae74fa619df3f2c" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_credit_hour_purchases" DROP CONSTRAINT "FK_fe081260519cae74fa619df3f2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" DROP CONSTRAINT "FK_fbbd09452b5a854ffce9309c3bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" DROP CONSTRAINT "FK_ae98ecb9b823cd83099ac2c8c19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" DROP CONSTRAINT "FK_1961ed9e51a9c1cefc0775badc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_132af5cf621724a4dcd5220ad65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_6a53cae74754a238e32ba515c41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP CONSTRAINT "FK_d72ceaccef5bba1247042358bde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_stats" DROP CONSTRAINT "FK_7cfb6bc3964fdc0b7f7bfbb5794"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_reviews" DROP CONSTRAINT "FK_95e90f6de1b98f28946e413e173"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "FK_7c156a73a89976836f7f93e4801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "FK_563aed57adf515c0b22bc32f9df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "FK_7117f103c70f43c194f65026fa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "FK_bf8a45708809089440cd818730d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "FK_89aa7842a1a3a0260e6189e455b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "FK_4d03fa9453d9514ea92081d0159"`,
    );
    await queryRunner.query(`DROP INDEX "public"."partner_referrals_pkey"`);
    await queryRunner.query(`DROP TABLE "partner_referrals"`);
    await queryRunner.query(
      `DROP INDEX "public"."partner_credit_hour_purchases_pkey"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."fki_fk_credit_purchase_partner_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."partner_credit_hour_purchases_stripe_session_id_key"`,
    );
    await queryRunner.query(`DROP TABLE "partner_credit_hour_purchases"`);
    await queryRunner.query(`DROP INDEX "public"."uq_partner_email"`);
    await queryRunner.query(`DROP INDEX "public"."partners_pkey"`);
    await queryRunner.query(`DROP TABLE "partners"`);
    await queryRunner.query(`DROP INDEX "public"."leads_pkey"`);
    await queryRunner.query(`DROP TABLE "leads"`);
    await queryRunner.query(`DROP INDEX "public"."pk_accepted_lifts"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_lift_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."fki_fk_accepted_lift_lifter_id"`,
    );
    await queryRunner.query(`DROP TABLE "accepted_lifts"`);
    await queryRunner.query(`DROP INDEX "public"."uq_booking_id"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_booking_id"`);
    await queryRunner.query(`DROP INDEX "public"."lifts_pkey"`);
    await queryRunner.query(`DROP TABLE "lifts"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_ending_address"`);
    await queryRunner.query(`DROP INDEX "public"."pr_booking"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_starting_address"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP INDEX "public"."pr_address"`);
    await queryRunner.query(`DROP TABLE "addresses"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_lifter_address"`);
    await queryRunner.query(`DROP INDEX "public"."lifters_email_phone_key"`);
    await queryRunner.query(`DROP INDEX "public"."lifters_email_key"`);
    await queryRunner.query(`DROP INDEX "public"."pr_lifters"`);
    await queryRunner.query(`DROP INDEX "public"."lifters_phone_key"`);
    await queryRunner.query(`DROP INDEX "public"."lifters_user_id_key"`);
    await queryRunner.query(`DROP TABLE "lifters"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_lifter_stats_id"`);
    await queryRunner.query(`DROP TABLE "lifter_stats"`);
    await queryRunner.query(`DROP INDEX "public"."lifter_reviews_pkey"`);
    await queryRunner.query(
      `DROP INDEX "public"."fki_fk_lifter_review_lifter_id"`,
    );
    await queryRunner.query(`DROP TABLE "lifter_reviews"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_equipment_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."lifter_equipment_lifter_id_equipment_id_key"`,
    );
    await queryRunner.query(`DROP INDEX "public"."pk_lifter_equipment"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_lifter_id"`);
    await queryRunner.query(`DROP TABLE "lifter_equipment"`);
    await queryRunner.query(`DROP INDEX "public"."equipment_pkey"`);
    await queryRunner.query(`DROP TABLE "equipment"`);
    await queryRunner.query(
      `DROP INDEX "public"."lifter_completed_training_videos_pkey"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."fki_fk_lifter_id_completed_videos"`,
    );
    await queryRunner.query(`DROP INDEX "public"."unique_lifter_video"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_video_id"`);
    await queryRunner.query(`DROP TABLE "lifter_completed_training_videos"`);
    await queryRunner.query(`DROP INDEX "public"."training_videos_pkey"`);
    await queryRunner.query(`DROP TABLE "training_videos"`);
    await queryRunner.query(`DROP INDEX "public"."Unique_row"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_badge_id"`);
    await queryRunner.query(`DROP INDEX "public"."pk_completed_lifter_badge"`);
    await queryRunner.query(`DROP INDEX "public"."fki_fk_lifter_id_to_badge"`);
    await queryRunner.query(`DROP TABLE "completed_lifter_badges"`);
    await queryRunner.query(`DROP INDEX "public"."pk_badges"`);
    await queryRunner.query(`DROP TABLE "badges"`);
  }
}
