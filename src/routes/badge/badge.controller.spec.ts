import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { configService } from '@src/config/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Badge } from '@src/model/badges.entity';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';

describe('BadgeController', () => {
  let controller: BadgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Badge]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      controllers: [BadgeController],
      providers: [BadgeService],
    }).compile();

    controller = module.get<BadgeController>(BadgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
