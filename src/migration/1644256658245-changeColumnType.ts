import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeColumnType1644256658245 implements MigrationInterface {
  name = 'changeColumnType1644256658245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "plaid_access_token"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "plaid_access_token" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "plaid_access_token"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "plaid_access_token" json`,
    );
  }
}
