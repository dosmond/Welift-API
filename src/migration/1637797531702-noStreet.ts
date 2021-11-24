import { MigrationInterface, QueryRunner } from 'typeorm';

export class noStreet1637797531702 implements MigrationInterface {
  name = 'noStreet1637797531702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "street"`);
    await queryRunner.query(
      `ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP CONSTRAINT "FK_d72ceaccef5bba1247042358bde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD CONSTRAINT "UQ_d72ceaccef5bba1247042358bde" UNIQUE ("address")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ALTER COLUMN "lifter_rating" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ALTER COLUMN "current_bonus" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "tt_lead_id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "leads_tt_lead_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "tt_lead_id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_132af5cf621724a4dcd5220ad65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_6a53cae74754a238e32ba515c41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "UQ_132af5cf621724a4dcd5220ad65" UNIQUE ("starting_address")`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "UQ_6a53cae74754a238e32ba515c41" UNIQUE ("ending_address")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT 0`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "UQ_6a53cae74754a238e32ba515c41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "UQ_132af5cf621724a4dcd5220ad65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_6a53cae74754a238e32ba515c41" FOREIGN KEY ("ending_address") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_132af5cf621724a4dcd5220ad65" FOREIGN KEY ("starting_address") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "tt_lead_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "leads_tt_lead_id_seq" OWNED BY "leads"."tt_lead_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "tt_lead_id" SET DEFAULT nextval('"leads_tt_lead_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ALTER COLUMN "current_bonus" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ALTER COLUMN "lifter_rating" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP CONSTRAINT "UQ_d72ceaccef5bba1247042358bde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD CONSTRAINT "FK_d72ceaccef5bba1247042358bde" FOREIGN KEY ("address") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "street" character varying(128) NOT NULL`,
    );
  }
}
