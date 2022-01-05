import { PushNotificationHelper } from './../../helper/pushNotification.helper';
import { EventNames } from './../../enum/eventNames.enum';
import { AuthService } from './../../auth/auth.service';
import { AcceptedLiftService } from './../accepted-lift/accepted-lift.service';
import { LifterStatsService } from './../lifter-stats/lifter-stats.service';
import { LifterReviewsService } from './../lifter-reviews/lifter-reviews.service';
import { LifterEquipmentService } from './../lifter-equipment/lifter-equipment.service';
import { LifterCompletedTrainingVideosService } from './../lifter-completed-training-videos/lifter-completed-training-videos.service';
import { CompletedLifterBadgeService } from './../completed-lifter-badge/completed-lifter-badge.service';
import { AddressService } from './../address/address.service';
import { AWSS3Helper } from './../../helper/awss3.helper';
import { TextClient } from './../../helper/text.client';
import { PendingVerificationDTO } from './../../dto/pendingVerification.dto';
import { LifterStats } from './../../model/lifterStats.entity';
import { LifterUpdateBatchDTO } from './../../dto/lifter.update.batch.dto';
import { AddressDTO } from '@src/dto/address.dto';
import { LifterBatchDTO } from './../../dto/lifter.batch.dto';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { LifterDTO } from './../../dto/lifter.dto';
import { Lifter } from '@src/model/lifters.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, Between } from 'typeorm';
import { User } from '@src/user.decorator';
import { LifterUpdateDTO } from '@src/dto/lifter.update.dto';
import { AddressUpdateDTO } from '@src/dto/address.update.dto';
import { PendingVerification } from '@src/model/pendingVerification.entity';
import { EmailClient } from '@src/helper/email.client';
import { OnEvent } from '@nestjs/event-emitter';
import { PushNotificationRequest } from '@src/helper/pushNotification.helper';

@Injectable()
export class LiftersService {
  constructor(
    @InjectRepository(Lifter) private readonly repo: Repository<Lifter>,
    @InjectRepository(LifterStats)
    private readonly statsRepo: Repository<LifterStats>,
    @InjectRepository(PendingVerification)
    private readonly verificationRepo: Repository<PendingVerification>,
    private readonly textClient: TextClient,
    private readonly emailClient: EmailClient,
    private readonly s3Helper: AWSS3Helper,
    private readonly addressService: AddressService,
    private readonly completedLifterBadgeService: CompletedLifterBadgeService,
    private readonly completedTrainingVideoService: LifterCompletedTrainingVideosService,
    private readonly lifterEquipmentService: LifterEquipmentService,
    private readonly lifterReviewSerivce: LifterReviewsService,
    private readonly lifterStatsService: LifterStatsService,
    private readonly acceptedLiftService: AcceptedLiftService,
    private readonly authService: AuthService,
    private readonly pushNotificationHelper: PushNotificationHelper,
  ) {}

  public async getById(user: User, id: string): Promise<LifterDTO> {
    return LifterDTO.fromEntity(
      await this.repo.findOne(
        { id: id },
        {
          relations: [
            'lifterReviews',
            'lifterStats',
            'address',
            'lifterEquipments',
            'completedLifterBadges',
            'lifterCompletedTrainingVideos',
          ],
        },
      ),
    );
  }

  public async getByUserId(user: User, userId: string): Promise<LifterDTO> {
    return LifterDTO.fromEntity(
      await this.repo.findOne(
        { userId: userId },
        {
          relations: [
            'lifterReviews',
            'lifterStats',
            'address',
            'lifterEquipments',
            'completedLifterBadges',
            'lifterCompletedTrainingVideos',
          ],
        },
      ),
    );
  }

  public async getAllNotPassedBc(): Promise<LifterDTO[]> {
    const result = await this.repo.find({ where: { passedBc: false } });
    return result.map((item) => LifterDTO.fromEntity(item));
  }

  public async getLiftersFlaggedForDeletion(): Promise<LifterDTO[]> {
    const result = await this.repo.find({ where: { deletionPending: true } });
    return result.map((item) => LifterDTO.fromEntity(item));
  }

  public async getAll(request: PaginatedDTO): Promise<LifterDTO[]> {
    const { start, end, page, pageSize, order } = request;

    const options: FindManyOptions = {
      relations: [],
    };

    if (start && end) {
      options.where = { creationDate: Between(start, end) };
    }
    if (start) {
      options.where = { creationDate: Between(start, new Date()) };
    }

    options.order = { creationDate: order };

    // Pagination
    if (page && pageSize) {
      options.skip = (page - 1) * pageSize;
      options.take = pageSize;
    }

    return await this.repo
      .find(options)
      .then((items) => items.map((item) => LifterDTO.fromEntity(item)));
  }

  public async count(request: PaginatedDTO): Promise<number> {
    const { start, end } = request;

    const options: FindManyOptions = {};

    // Time Queries
    if (start && end) options.where = { creationDate: Between(start, end) };
    else if (start)
      options.where = { creationDate: Between(start, new Date()) };

    const [, count] = await this.repo.findAndCount(options);
    return count;
  }

  public async getProfilePicture(lifterId: string) {
    return await this.s3Helper.getProfilePicture(lifterId);
  }

  public async uploadProfilePicture(
    lifterId: string,
    file: Express.Multer.File,
  ) {
    return await this.s3Helper.uploadProfilePicture(lifterId, file);
  }

  public async createBatch(batch: LifterBatchDTO): Promise<LifterDTO> {
    const lifter = LifterDTO.from(batch.lifter);
    const address = AddressDTO.from(batch.address);

    // Create Address
    const addressResult = await this.addressService.create(null, address);
    lifter.addressId = addressResult.id;

    // Create Lifter
    const result = LifterDTO.fromEntity(
      await this.repo.save(lifter.toEntity()),
    );

    // Create Lifter Stats row
    const lifterStats = new LifterStats();
    lifterStats.lifterId = result.id;
    await this.statsRepo.save(lifterStats);
    return result;
  }

  public async beginVerifyPhoneNumber(
    request: PendingVerificationDTO,
  ): Promise<void> {
    const dto = PendingVerificationDTO.from(request);
    const result = await this.verificationRepo.findOne({ user: dto.user });

    const textObject = {
      phoneNumber: dto.user,
      code: null,
    };

    if (result) {
      result.code = this.generateVerificationCode();
      await this.verificationRepo.save(result);
      textObject.code = result.code;
    } else {
      dto.code = this.generateVerificationCode();
      await this.verificationRepo.save(dto.toEntity());
      textObject.code = dto.code;
    }

    await this.textClient.sendPhoneVerificationText(textObject);
  }

  public async beginVerifyEmail(
    request: PendingVerificationDTO,
  ): Promise<void> {
    const dto = PendingVerificationDTO.from(request);
    const result = await this.verificationRepo.findOne({ user: dto.user });

    const emailObject = {
      email: dto.user,
      code: null,
    };

    if (result) {
      result.code = this.generateVerificationCode();
      await this.verificationRepo.save(result);
      emailObject.code = result.code;
    } else {
      dto.code = this.generateVerificationCode();
      await this.verificationRepo.save(dto.toEntity());
      emailObject.code = dto.code;
    }

    await this.emailClient.sendEmailVerification(emailObject);
  }

  public async verifyCode(request: PendingVerificationDTO): Promise<void> {
    const dto = PendingVerificationDTO.from(request);
    const result = await this.verificationRepo.findOne({ user: dto.user });

    if (result?.code !== dto.code)
      throw new ConflictException('Code is incorrect');

    await this.verificationRepo.delete({ id: result.id });
  }

  public async updateBatch(batch: LifterUpdateBatchDTO): Promise<LifterDTO> {
    const lifter = LifterUpdateDTO.from(batch.lifter);
    const address = AddressUpdateDTO.from(batch.address);

    if (batch.address) {
      const addressResult = await this.addressService.update(null, address);
      lifter.addressId = addressResult.id;
    }

    return LifterDTO.fromEntity(await this.repo.save(lifter.toEntity()));
  }

  public async deleteLifter(lifter: Lifter): Promise<void> {
    // Lifter Stats
    await this.lifterStatsService.deleteByLifterId(lifter.id);

    // Badges
    await this.completedLifterBadgeService.deleteByLifterId(lifter.id);

    // Equipment
    await this.lifterEquipmentService.deleteByLifterId(lifter.id);

    // Address
    await this.addressService.delete(lifter.addressId);

    // Accepted Lift
    await this.acceptedLiftService.deleteAllByLifterId(lifter.id);

    // Lifter Reviews
    await this.lifterReviewSerivce.deleteByLifterId(lifter.id);

    // Training Videos
    await this.completedTrainingVideoService.deleteByLifterId(lifter.id);

    // Lifter
    await this.repo.delete({ id: lifter.id });

    // Profile Picture
    await this.s3Helper.deleteProfilePicture(lifter.id);

    // Cognito User
    await this.authService.deleteUser({
      appName: 'landing',
      username: lifter.email,
    });
  }

  private generateVerificationCode(): string {
    return (
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    ).toString();
  }

  @OnEvent(EventNames.CheckPassedBc)
  private async handleCheckPassedBcEvent() {
    const lifters = await this.getAllNotPassedBc();

    const promises: Promise<void>[] = [];
    lifters.forEach((lifter) => {
      const request = new PushNotificationRequest({
        topic: `/topics/${process.env.NODE_ENV}-${lifter.id}`,
        title: 'Background Check',
        message:
          'Complete your background check so you can start earning with Welift today!',
      });

      promises.push(
        this.pushNotificationHelper.sendPushNotificationToTopic(request),
      );
    });

    await Promise.all(promises);
  }

  @OnEvent(EventNames.DeleteFlaggedLifters)
  private async handleDeleteFlaggedLifters() {
    const lifters = await this.getLiftersFlaggedForDeletion();

    const promises: Promise<void>[] = [];

    lifters.forEach((lifter) => {
      promises.push(this.deleteLifter(lifter.toEntity()));
    });

    await Promise.all(promises);
  }
}
