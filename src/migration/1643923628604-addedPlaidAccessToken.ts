import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedPlaidAccessToken1643923628604 implements MigrationInterface {
  name = 'addedPlaidAccessToken1643923628604';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "plaid_access_token" json`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "plaid_access_token"`,
    );
  }
}
