import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixLeadCreationDate1642186358001 implements MigrationInterface {
  name = 'fixLeadCreationDate1642186358001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "creation_date"`);
    await queryRunner.query(
      `ALTER TABLE "leads" ADD "creation_date" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "creation_date"`);
    await queryRunner.query(
      `ALTER TABLE "leads" ADD "creation_date" date DEFAULT now()`,
    );
  }
}
