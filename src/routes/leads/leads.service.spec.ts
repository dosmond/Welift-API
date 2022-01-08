import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { EmailClient } from '@src/helper/email.client';
import { SlackHelper } from '@src/helper/slack.helper';
import { Lead } from '@src/model/leads.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Lead]),
      ],
      controllers: [LeadsController],
      providers: [LeadsService, SlackHelper, EmailClient],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
