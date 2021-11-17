import { LifterCompletedTrainingVideo } from './../../model/lifterCompletedTrainingVideos.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { LifterCompletedTrainingVideoDTO } from 'src/dto/liftercompletedTrainingVideo.dto';
import { User } from 'src/user.decorator';

@Injectable()
export class LifterCompletedTrainingVideosService {
  constructor(
    @InjectRepository(LifterCompletedTrainingVideo)
    private readonly repo: Repository<LifterCompletedTrainingVideo>,
  ) {}

  public async getById(id: string): Promise<LifterCompletedTrainingVideoDTO> {
    return LifterCompletedTrainingVideoDTO.fromEntity(
      await this.repo.findOne({ id: id }),
    );
  }

  public async getLifterCompletedVideos(
    lifterId: string,
  ): Promise<LifterCompletedTrainingVideoDTO[]> {
    return await this.repo
      .find({ where: { lifterId: lifterId } })
      .then((items) =>
        items.map((item) => LifterCompletedTrainingVideoDTO.fromEntity(item)),
      );
  }

  public async create(
    user: User,
    video: LifterCompletedTrainingVideoDTO,
  ): Promise<LifterCompletedTrainingVideoDTO> {
    const dto = LifterCompletedTrainingVideoDTO.from(video);
    return LifterCompletedTrainingVideoDTO.fromEntity(
      await this.repo.save(dto.toEntity(user)),
    );
  }

  public async delete(user: User, id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }
}
