import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedAlias1639674662903 implements MigrationInterface {
  name = 'addedAlias1639674662903';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "alias" character varying(128)`,
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
    await queryRunner.query(`ALTER TABLE "lifters" DROP COLUMN "alias"`);
  }
}
