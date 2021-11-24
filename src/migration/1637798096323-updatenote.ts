import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatenote1637798096323 implements MigrationInterface {
  name = 'updatenote1637798096323';

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
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_cc1e3a3a0d5b96973554472d3df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "lead_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "booking_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_cc1e3a3a0d5b96973554472d3df" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_cc1e3a3a0d5b96973554472d3df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "booking_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "lead_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_cc1e3a3a0d5b96973554472d3df" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
