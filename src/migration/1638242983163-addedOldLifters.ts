import {MigrationInterface, QueryRunner} from "typeorm";

export class addedOldLifters1638242983163 implements MigrationInterface {
    name = 'addedOldLifters1638242983163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wiw_lifters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(1024), "email" character varying(1024), "phone" character varying(1024), "location" character varying(1024), CONSTRAINT "PK_7f828f66f68c46492a71cca3094" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "pr_wiw_lifter" ON "wiw_lifters" ("id") `);
        await queryRunner.query(`ALTER TABLE "notes" ADD "creation_date" date DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "lifter_rating" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "current_bonus" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "current_bonus" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "lifter_rating" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "creation_date"`);
        await queryRunner.query(`DROP INDEX "public"."pr_wiw_lifter"`);
        await queryRunner.query(`DROP TABLE "wiw_lifters"`);
    }

}
