import {MigrationInterface, QueryRunner} from "typeorm";

export class alterWhatsNewAndLifter1641323582183 implements MigrationInterface {
    name = 'alterWhatsNewAndLifter1641323582183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lifters" DROP COLUMN "latest_open"`);
        await queryRunner.query(`ALTER TABLE "lifters" ADD "latest_open" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "whats_new" DROP COLUMN "creation_date"`);
        await queryRunner.query(`ALTER TABLE "whats_new" ADD "creation_date" TIMESTAMP DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "whats_new" DROP COLUMN "creation_date"`);
        await queryRunner.query(`ALTER TABLE "whats_new" ADD "creation_date" date DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lifters" DROP COLUMN "latest_open"`);
        await queryRunner.query(`ALTER TABLE "lifters" ADD "latest_open" date NOT NULL DEFAULT now()`);
    }

}
