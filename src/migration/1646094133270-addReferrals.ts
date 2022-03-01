import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReferrals1646094133270 implements MigrationInterface {
  name = 'addReferrals1646094133270';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "referrer_code" character varying(64) NOT NULL DEFAULT generate_random_referral()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" ADD "referred_code" character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" ADD "is_referral" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" ADD "accepted_lift_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" ADD CONSTRAINT "UQ_06e5f6c07e41e4984ae8f1524e9" UNIQUE ("accepted_lift_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" ADD "transaction_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" ADD CONSTRAINT "UQ_363679d7f617f342fbff6acf69f" UNIQUE ("transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" ADD CONSTRAINT "FK_06e5f6c07e41e4984ae8f1524e9" FOREIGN KEY ("accepted_lift_id") REFERENCES "accepted_lifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" ADD CONSTRAINT "FK_363679d7f617f342fbff6acf69f" FOREIGN KEY ("transaction_id") REFERENCES "lifter_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" DROP CONSTRAINT "FK_363679d7f617f342fbff6acf69f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" DROP CONSTRAINT "FK_06e5f6c07e41e4984ae8f1524e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" DROP CONSTRAINT "UQ_363679d7f617f342fbff6acf69f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accepted_lifts" DROP COLUMN "transaction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" DROP CONSTRAINT "UQ_06e5f6c07e41e4984ae8f1524e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" DROP COLUMN "accepted_lift_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" DROP COLUMN "is_referral"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "referred_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifters" DROP COLUMN "referrer_code"`,
    );
  }
}
