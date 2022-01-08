import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { EmailClient } from '@src/helper/email.client';
import { Partner } from '@src/model/partner.entity';
import { PartnerReferral } from '@src/model/partnerReferrals.entity';
import { PartnersService } from './partners.service';

describe('PartnersService', () => {
  let service: PartnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([PartnerReferral, Partner]),
      ],
      providers: [PartnersService, EmailClient],
    }).compile();

    service = module.get<PartnersService>(PartnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
