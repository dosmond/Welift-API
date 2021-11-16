import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingVideoDTO } from 'src/dto/trainingVideo.dto';
import { TrainingVideo } from 'src/model/TrainingVideos.entity';
import { Repository } from 'typeorm';

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
}
