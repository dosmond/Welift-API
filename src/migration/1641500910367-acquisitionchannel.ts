import { MigrationInterface, QueryRunner } from 'typeorm';

export class acquisitionchannel1641500910367 implements MigrationInterface {
  name = 'acquisitionchannel1641500910367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" ADD "acquisition_channel" character varying(128)`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "acquisition_channel" character varying(128)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP COLUMN "acquisition_channel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" DROP COLUMN "acquisition_channel"`,
    );
  }
}
