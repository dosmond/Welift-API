import { MigrationInterface, QueryRunner } from "typeorm";

export class addedNotes1637007988931 implements MigrationInterface {
  name = 'addedNotes1637007988931'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying(128) NOT NULL, "lead_id" uuid NOT NULL, "booking_id" uuid NOT NULL, "note" character varying(1024) NOT NULL, "author" character varying(256) NOT NULL, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "pr_note" ON "notes" ("id") `);
    await queryRunner.query(`ALTER TABLE "booking" ADD "calendar_event_id" character varying(256)`);
    await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "lifter_rating" SET DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "current_bonus" SET DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "tt_lead_id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "leads_tt_lead_id_seq"`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "tt_lead_id" SET DEFAULT uuid_generate_v4()`);
    await queryRunner.query(`ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_cc1e3a3a0d5b96973554472d3df" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e"`);
    await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_cc1e3a3a0d5b96973554472d3df"`);
    await queryRunner.query(`ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "tt_lead_id" DROP DEFAULT`);
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "leads_tt_lead_id_seq" OWNED BY "leads"."tt_lead_id"`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "tt_lead_id" SET DEFAULT nextval('"leads_tt_lead_id_seq"')`);
    await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "current_bonus" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "lifter_rating" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "calendar_event_id"`);
    await queryRunner.query(`DROP INDEX "public"."pr_note"`);
    await queryRunner.query(`DROP TABLE "notes"`);
  }

}
