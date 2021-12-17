import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedTotalPay1639704316298 implements MigrationInterface {
  name = 'addedTotalPay1639704316298';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" ADD "total_pay" double precision NOT NULL DEFAULT 0.0`,
    );
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
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" DROP COLUMN "total_pay"`,
    );
  }
}
