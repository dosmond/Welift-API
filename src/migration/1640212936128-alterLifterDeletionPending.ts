import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterLifterDeletionPending1640212936128
  implements MigrationInterface
{
  name = 'alterLifterDeletionPending1640212936128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "deletion_pending" boolean NOT NULL DEFAULT false`,
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
      `ALTER TABLE "lifters" ALTER COLUMN "bc_in_progress" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_location_count" ALTER COLUMN "count" SET DEFAULT 0`,
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
      `ALTER TABLE "booking_location_count" ALTER COLUMN "count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ALTER COLUMN "bc_in_progress" SET NOT NULL`,
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
      `ALTER TABLE "lifters" DROP COLUMN "deletion_pending"`,
    );
  }
}
