import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingVideoDTO } from 'src/dto/trainingVideo.dto';
import { TrainingVideo } from 'src/model/TrainingVideos.entity';
import { User } from 'src/user.decorator';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TrainingVideosService {
  constructor(
    @InjectRepository(TrainingVideo)
    private readonly repo: Repository<TrainingVideo>,
  ) {}

  public async getAll() {
    return await this.repo.find().then((videos) => {
      return videos.map((video) => TrainingVideoDTO.fromEntity(video));
    });
  }

  public async getById(id: string): Promise<TrainingVideoDTO> {
    return await this.repo
      .findOne({ id: id })
      .then((video) => TrainingVideoDTO.fromEntity(video));
  }

  public async addTrainingVideo(
    user: User,
    request: TrainingVideoDTO,
  ): Promise<TrainingVideoDTO> {
    const dto = TrainingVideoDTO.from(request);
    return TrainingVideoDTO.fromEntity(
      await this.repo.save(dto.toEntity(user)),
    );
  }

  public async deleteTrainingVideo(
    user: User,
    id: string,
  ): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }
}
