import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedLeade1637797820314 implements MigrationInterface {
  name = 'UpdatedLeade1637797820314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT 0`,
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
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "leads_tt_lead_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT '0'`,
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
      `ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT '0'`,
    );
  }
}
