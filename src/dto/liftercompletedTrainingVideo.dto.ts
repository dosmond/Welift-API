import { Lifter } from '@src/model/lifters.entity';
import { TrainingVideo } from './../model/TrainingVideos.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { LifterCompletedTrainingVideo } from '@src//model/lifterCompletedTrainingVideos.entity';
import { User } from '@src/user.decorator';

export class LifterCompletedTrainingVideoDTO
  implements Readonly<LifterCompletedTrainingVideoDTO>
{
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  lifterId: string;

  @ApiProperty()
  @IsUUID()
  videoId: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TrainingVideo)
  video: TrainingVideo;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Lifter)
  lifter: Lifter;

  public static from(
    dto: Partial<LifterCompletedTrainingVideoDTO>,
  ): LifterCompletedTrainingVideoDTO {
    const badge = new LifterCompletedTrainingVideoDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(
    entity: LifterCompletedTrainingVideo,
  ): LifterCompletedTrainingVideoDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        lifterId: entity.lifterId,
        videoId: entity.videoId,
        video: entity.video,
        lifter: entity.lifter,
      });
    }
    return null;
  }

  public toEntity(user: User = null): LifterCompletedTrainingVideo {
    const badge = new LifterCompletedTrainingVideo();
    for (const property in this as LifterCompletedTrainingVideoDTO)
      badge[property] = this[property];
    return badge;
  }
}
