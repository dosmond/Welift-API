import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PartnerReferral } from '@src/model/partnerReferrals.entity';
import { PartnerReferralsService } from './partner-referrals.service';

describe('PartnerReferralsService', () => {
  let service: PartnerReferralsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([PartnerReferral]),
      ],
      providers: [PartnerReferralsService],
    }).compile();

    service = module.get<PartnerReferralsService>(PartnerReferralsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
