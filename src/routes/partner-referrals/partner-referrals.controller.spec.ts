import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PartnerReferral } from '@src/model/partnerReferrals.entity';
import { PartnerReferralsController } from './partner-referrals.controller';
import { PartnerReferralsService } from './partner-referrals.service';

describe('PartnerReferralsController', () => {
  let controller: PartnerReferralsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([PartnerReferral]),
      ],
      controllers: [PartnerReferralsController],
      providers: [PartnerReferralsService],
    }).compile();

    controller = module.get<PartnerReferralsController>(
      PartnerReferralsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
