import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInternalLifterRanking1645824795517
  implements MigrationInterface
{
  name = 'addInternalLifterRanking1645824795517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "internal_ranking" character varying(64) NOT NULL DEFAULT 'Rookie'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "internal_ranking"`,
    );
  }
}
