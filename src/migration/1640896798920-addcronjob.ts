import { MigrationInterface, QueryRunner } from 'typeorm';

export class addcronjob1640896798920 implements MigrationInterface {
  name = 'addcronjob1640896798920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cron_job_description" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(256) NOT NULL, "data" json NOT NULL, CONSTRAINT "PK_189765876c64db8c10f8d98d845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_cron_job" ON "cron_job_description" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."pk_cron_job"`);
    await queryRunner.query(`DROP TABLE "cron_job_description"`);
  }
}
