import { MigrationInterface, QueryRunner } from 'typeorm';

export class altercronjob1640902268950 implements MigrationInterface {
  name = 'altercronjob1640902268950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cron_job_description" RENAME COLUMN "name" TO "key"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cron_job_description" RENAME COLUMN "key" TO "name"`,
    );
  }
}
