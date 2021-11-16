import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString } from 'class-validator';
import { User } from 'src/user.decorator';
import { TrainingVideo } from 'src/model/TrainingVideos.entity';

export class TrainingVideoDTO implements Readonly<TrainingVideoDTO> {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  public static from(dto: Partial<TrainingVideoDTO>): TrainingVideoDTO {
    const lift = new TrainingVideoDTO();
    for (const property in dto) lift[property] = dto[property];

    return lift;
  }

  public static fromEntity(entity: TrainingVideo): TrainingVideoDTO {
    if (entity)
      return this.from({
        id: entity.id,
        name: entity.name,
      });

    return null;
  }

  public toEntity(user: User = null): TrainingVideo {
    const trainingVideo = new TrainingVideo();
    trainingVideo.id = this.id;
    trainingVideo.name = this.name;
    return trainingVideo;
  }
}
