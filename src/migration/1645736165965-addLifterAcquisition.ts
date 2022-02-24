import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLifterAcquisition1645736165965 implements MigrationInterface {
  name = 'addLifterAcquisition1645736165965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "acquisition_channel" character varying(128) NOT NULL DEFAULT 'Not Tracked'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "acquisition_channel"`,
    );
  }
}
