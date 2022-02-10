import { MigrationInterface, QueryRunner } from 'typeorm';

export class lifterRanking1644509305312 implements MigrationInterface {
  name = 'lifterRanking1644509305312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "ranking" character varying(64) NOT NULL DEFAULT 'Basic'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lifters" DROP COLUMN "ranking"`);
  }
}
