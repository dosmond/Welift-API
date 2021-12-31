import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterLifters1640972890535 implements MigrationInterface {
  name = 'alterLifters1640972890535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "latest_open" date NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lifters" DROP COLUMN "latest_open"`);
  }
}
