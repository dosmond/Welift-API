import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterReview } from '@src/model/lifterReviews.entity';
import { LifterReviewsController } from './lifter-reviews.controller';
import { LifterReviewsService } from './lifter-reviews.service';

describe('LifterReviewsController', () => {
  let controller: LifterReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterReview]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      controllers: [LifterReviewsController],
      providers: [LifterReviewsService],
    }).compile();

    controller = module.get<LifterReviewsController>(LifterReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
