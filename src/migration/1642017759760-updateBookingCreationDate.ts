import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateBookingCreationDate1642017759760
  implements MigrationInterface
{
  name = 'updateBookingCreationDate1642017759760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP COLUMN "creation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "creation_date" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP COLUMN "creation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "creation_date" date DEFAULT now()`,
    );
  }
}
