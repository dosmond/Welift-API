import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBookingDescription1641835691142 implements MigrationInterface {
  name = 'addBookingDescription1641835691142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "description" character varying(1024)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "description"`);
  }
}
