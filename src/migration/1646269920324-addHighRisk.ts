import { MigrationInterface, QueryRunner } from 'typeorm';

export class addHighRisk1646269920324 implements MigrationInterface {
  name = 'addHighRisk1646269920324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "is_high_risk" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "is_high_risk"`);
  }
}
