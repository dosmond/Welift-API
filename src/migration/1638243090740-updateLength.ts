import {MigrationInterface, QueryRunner} from "typeorm";

export class updateLength1638243090740 implements MigrationInterface {
    name = 'updateLength1638243090740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "lifter_rating" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "current_bonus" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "schedule"`);
        await queryRunner.query(`ALTER TABLE "leads" ADD "schedule" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partners" ALTER COLUMN "total_credits" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lifts" ALTER COLUMN "current_lifter_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "schedule"`);
        await queryRunner.query(`ALTER TABLE "leads" ADD "schedule" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "current_bonus" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lifters" ALTER COLUMN "lifter_rating" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lifter_stats" ALTER COLUMN "completed_moves" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "badges" ALTER COLUMN "required_value" SET DEFAULT '0'`);
    }

}
