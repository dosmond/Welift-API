import { AuthModule } from './../../auth/auth.module';
import { WhatsNewService } from './whats-new.service';
import { WhatsNew } from '@src/model/whatsnew.entity';
import { WhatsNewController } from './whats-new.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';

describe('TrainingVideosController', () => {
  let controller: WhatsNewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([WhatsNew]),
        AuthModule,
      ],
      controllers: [WhatsNewController],
      providers: [WhatsNewService],
    }).compile();

    controller = module.get<WhatsNewController>(WhatsNewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
