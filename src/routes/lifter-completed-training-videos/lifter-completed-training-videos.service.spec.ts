import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { TrainingVideo } from './../../model/TrainingVideos.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Address } from '@src/model/addresses.entity';
import { LifterCompletedTrainingVideo } from '@src/model/lifterCompletedTrainingVideos.entity';
import { LifterCompletedTrainingVideosController } from './lifter-completed-training-videos.controller';
import { LifterCompletedTrainingVideosService } from './lifter-completed-training-videos.service';
import { Lifter } from '@src/model/lifters.entity';
import { Repository } from 'typeorm';
import { LifterCompletedTrainingVideoDTO } from '@src/dto/liftercompletedTrainingVideo.dto';

describe('LifterCompletedTrainingVideosService', () => {
  let service: LifterCompletedTrainingVideosService;
  let lifterRepo: Repository<Lifter>;
  let trainingVideoRepo: Repository<TrainingVideo>;
  let addressRepo: Repository<Address>;
  let completedVideoRepo: Repository<LifterCompletedTrainingVideo>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([
          LifterCompletedTrainingVideo,
          Lifter,
          Address,
          TrainingVideo,
        ]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      controllers: [LifterCompletedTrainingVideosController],
      providers: [LifterCompletedTrainingVideosService],
    }).compile();

    service = module.get<LifterCompletedTrainingVideosService>(
      LifterCompletedTrainingVideosService,
    );
    lifterRepo = module.get(getRepositoryToken(Lifter));
    addressRepo = module.get(getRepositoryToken(Address));
    trainingVideoRepo = module.get(getRepositoryToken(TrainingVideo));
    completedVideoRepo = module.get(
      getRepositoryToken(LifterCompletedTrainingVideo),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    let completedVideo: LifterCompletedTrainingVideo;

    beforeEach(async () => {
      const { createdCompletedVideo } = await setup();
      completedVideo = createdCompletedVideo;
    });

    it('should return the correct completed training video', async () => {
      const video = await service.getById(completedVideo.id);
      expect(video.id).toEqual(completedVideo.id);
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('getLifterCompletedVideos', () => {
    let lifter: Lifter;

    beforeEach(async () => {
      const { lifter: createdLifter } = await setup();
      lifter = createdLifter;
    });

    it('should return the correct completed training videos', async () => {
      const video = await service.getLifterCompletedVideos(lifter.id);
      expect(video.length).toEqual(1);
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('create', () => {
    let lifter: Lifter;
    let videos: TrainingVideo[];

    beforeEach(async () => {
      const { videos: createdVideos, lifter: createdLifter } = await setup();
      lifter = createdLifter;
      videos = createdVideos;
    });

    it('should successfully create a completed training video', async () => {
      const newCompleted = new LifterCompletedTrainingVideoDTO({
        lifterId: lifter.id,
        videoId: videos[1].id,
      });
      const video = await service.create(null, newCompleted);
      expect(video.id).not.toBeNull();
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('delete', () => {
    let completedVideo: LifterCompletedTrainingVideo;

    beforeEach(async () => {
      const { createdCompletedVideo } = await setup();
      completedVideo = createdCompletedVideo;
    });

    it('should successfully delete a completed training video', async () => {
      await service.delete(null, completedVideo.id);

      const completed = await completedVideoRepo.findOne({
        id: completedVideo.id,
      });

      expect(completed).toBeUndefined();
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('deleteByLifterId', () => {
    let lifter: Lifter;
    let completedVideo: LifterCompletedTrainingVideo;

    beforeEach(async () => {
      const { lifter: createdLifter, createdCompletedVideo } = await setup();
      lifter = createdLifter;
      completedVideo = createdCompletedVideo;
    });

    it('should successfully delete the training videos associated with the lifter', async () => {
      await service.deleteByLifterId(lifter.id);

      const completed = await completedVideoRepo.findOne({
        id: completedVideo.id,
      });

      expect(completed).toBeUndefined();
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  const setup = async () => {
    const videos = [
      await trainingVideoRepo.save(
        new TrainingVideo({
          name: 'Test1',
        }),
      ),
      await trainingVideoRepo.save(
        new TrainingVideo({
          name: 'Test2',
        }),
      ),
    ];

    const lifter = await lifterRepo.save(
      new Lifter({
        firstName: 'test',
        lastName: 'test',
        phone: '8015555555',
        passedBc: false,
        bcInProgress: false,
        email: 'test@test.com',
        hasPickupTruck: true,
        status: 'contacted',
        userId: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
        addressId: (
          await addressRepo.save(
            new Address({
              street: 'test1',
              street2: 'test1',
              city: 'city',
              state: 'state',
              postalCode: 'postalCode',
            }),
          )
        ).id,
      }),
    );

    const createdCompletedVideo = await completedVideoRepo.save(
      new LifterCompletedTrainingVideo({
        lifterId: lifter.id,
        videoId: videos[0].id,
      }),
    );

    return { videos, lifter, createdCompletedVideo };
  };

  const cleanUp = async () => {
    const completedVideos = await completedVideoRepo.find();

    for (const completed of completedVideos) {
      await completedVideoRepo.delete({ id: completed.id });
    }

    const videos = await trainingVideoRepo.find();
    for (const video of videos) {
      await trainingVideoRepo.delete({ id: video.id });
    }

    const lifters = await lifterRepo.find();

    for (const lifter of lifters) {
      await lifterRepo.delete({ id: lifter.id });
    }

    const addresses = await addressRepo.find();
    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }
  };
});
