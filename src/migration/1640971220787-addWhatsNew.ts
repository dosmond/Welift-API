import { MigrationInterface, QueryRunner } from 'typeorm';

export class addWhatsNew1640971220787 implements MigrationInterface {
  name = 'addWhatsNew1640971220787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "whats_new" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" json NOT NULL, "creation_date" date DEFAULT now(), CONSTRAINT "PK_907d6b98599b9ba35dae30cdd5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_whats_new" ON "whats_new" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."pk_whats_new"`);
    await queryRunner.query(`DROP TABLE "whats_new"`);
  }
}
