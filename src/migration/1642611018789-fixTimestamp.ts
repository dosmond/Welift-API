import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixTimestamp1642611018789 implements MigrationInterface {
  name = 'fixTimestamp1642611018789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "creation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "creation_date" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "creation_date"`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "creation_date" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners" DROP COLUMN "creation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners" ADD "creation_date" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" DROP COLUMN "creation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ADD "creation_date" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_response" DROP COLUMN "creation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ADD "creation_date" date DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners" DROP COLUMN "creation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners" ADD "creation_date" date DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "creation_date"`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "creation_date" date DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "creation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "creation_date" date DEFAULT now()`,
    );
  }
}
