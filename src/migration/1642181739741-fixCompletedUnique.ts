import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixCompletedUnique1642181739741 implements MigrationInterface {
  name = 'fixCompletedUnique1642181739741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."Unique_row"`);
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "FK_89aa7842a1a3a0260e6189e455b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "FK_4d03fa9453d9514ea92081d0159"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "UQ_89aa7842a1a3a0260e6189e455b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "UQ_4d03fa9453d9514ea92081d0159"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "uq_badge_id_lifter_id" UNIQUE ("badge_id", "lifter_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "FK_4d03fa9453d9514ea92081d0159" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "FK_89aa7842a1a3a0260e6189e455b" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "FK_89aa7842a1a3a0260e6189e455b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "FK_4d03fa9453d9514ea92081d0159"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" DROP CONSTRAINT "uq_badge_id_lifter_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "UQ_4d03fa9453d9514ea92081d0159" UNIQUE ("badge_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "UQ_89aa7842a1a3a0260e6189e455b" UNIQUE ("lifter_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "FK_4d03fa9453d9514ea92081d0159" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_lifter_badges" ADD CONSTRAINT "FK_89aa7842a1a3a0260e6189e455b" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "Unique_row" ON "completed_lifter_badges" ("lifter_id", "badge_id") `,
    );
  }
}
