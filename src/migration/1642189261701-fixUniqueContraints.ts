import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixUniqueContraints1642189261701 implements MigrationInterface {
  name = 'fixUniqueContraints1642189261701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "FK_7117f103c70f43c194f65026fa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "FK_bf8a45708809089440cd818730d"`,
    );
    await queryRunner.query(`DROP INDEX "public"."unique_lifter_video"`);
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "UQ_7117f103c70f43c194f65026fa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "UQ_bf8a45708809089440cd818730d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "FK_7c156a73a89976836f7f93e4801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "FK_563aed57adf515c0b22bc32f9df"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."lifter_equipment_lifter_id_equipment_id_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "UQ_7c156a73a89976836f7f93e4801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "UQ_563aed57adf515c0b22bc32f9df"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_lifter_video" ON "lifter_completed_training_videos" ("lifter_id", "video_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifter_equipment_lifter_id_equipment_id_key" ON "lifter_equipment" ("equipment_id", "lifter_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "uq_lifterId_videoId" UNIQUE ("lifter_id", "video_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "uq_lifterId_equipmentId" UNIQUE ("lifter_id", "equipment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "FK_bf8a45708809089440cd818730d" FOREIGN KEY ("video_id") REFERENCES "training_videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "FK_7117f103c70f43c194f65026fa8" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "FK_563aed57adf515c0b22bc32f9df" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "FK_7c156a73a89976836f7f93e4801" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "FK_7c156a73a89976836f7f93e4801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "FK_563aed57adf515c0b22bc32f9df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "FK_7117f103c70f43c194f65026fa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "FK_bf8a45708809089440cd818730d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" DROP CONSTRAINT "uq_lifterId_equipmentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" DROP CONSTRAINT "uq_lifterId_videoId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."lifter_equipment_lifter_id_equipment_id_key"`,
    );
    await queryRunner.query(`DROP INDEX "public"."unique_lifter_video"`);
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "UQ_563aed57adf515c0b22bc32f9df" UNIQUE ("equipment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "UQ_7c156a73a89976836f7f93e4801" UNIQUE ("lifter_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "lifter_equipment_lifter_id_equipment_id_key" ON "lifter_equipment" ("lifter_id", "equipment_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "FK_563aed57adf515c0b22bc32f9df" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_equipment" ADD CONSTRAINT "FK_7c156a73a89976836f7f93e4801" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "UQ_bf8a45708809089440cd818730d" UNIQUE ("video_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "UQ_7117f103c70f43c194f65026fa8" UNIQUE ("lifter_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_lifter_video" ON "lifter_completed_training_videos" ("lifter_id", "video_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "FK_bf8a45708809089440cd818730d" FOREIGN KEY ("video_id") REFERENCES "training_videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lifter_completed_training_videos" ADD CONSTRAINT "FK_7117f103c70f43c194f65026fa8" FOREIGN KEY ("lifter_id") REFERENCES "lifters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
