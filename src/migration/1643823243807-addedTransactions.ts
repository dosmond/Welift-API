import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedTransactions1643823243807 implements MigrationInterface {
  name = 'addedTransactions1643823243807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lifter_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(128) NOT NULL, "date" TIMESTAMP WITH TIME ZONE DEFAULT now(), "remaining_balance" double precision NOT NULL, "amount" double precision NOT NULL, "fees" double precision NOT NULL DEFAULT '0', "is_quick_deposit" boolean NOT NULL DEFAULT false, "lifter_id" uuid NOT NULL, CONSTRAINT "PK_f8665b037c89affe691a9f6b0b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fki_fk_transaction_lifter_id" ON "lifter_transaction" ("lifter_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pr_lifter_transaction" ON "lifter_transaction" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" ADD CONSTRAINT "FK_57bfdc34e9001182ec230cbb4fc" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifter_transaction" DROP CONSTRAINT "FK_57bfdc34e9001182ec230cbb4fc"`,
    );
    await queryRunner.query(`DROP INDEX "public"."pr_lifter_transaction"`);
    await queryRunner.query(
      `DROP INDEX "public"."fki_fk_transaction_lifter_id"`,
    );
    await queryRunner.query(`DROP TABLE "lifter_transaction"`);
  }
}
