import { AuthModule } from './../../auth/auth.module';
import { EmailClient } from '@src/helper/email.client';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackHelper } from '@src/helper/slack.helper';
import { Lead } from '@src/model/leads.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { configService } from '@src/config/config.service';

describe('LeadsController', () => {
  let controller: LeadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Lead]),
        AuthModule,
      ],
      controllers: [LeadsController],
      providers: [LeadsService, SlackHelper, EmailClient],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
