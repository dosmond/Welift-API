import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { CompletedLifterBadge } from '@src/model/completedLifterBadges.entity';
import { CompletedLifterBadgeController } from './completed-lifter-badge.controller';
import { CompletedLifterBadgeService } from './completed-lifter-badge.service';

describe('CompletedLifterBadgeController', () => {
  let controller: CompletedLifterBadgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([CompletedLifterBadge]),
        AuthModule,
      ],
      controllers: [CompletedLifterBadgeController],
      providers: [CompletedLifterBadgeService],
    }).compile();

    controller = module.get<CompletedLifterBadgeController>(
      CompletedLifterBadgeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
