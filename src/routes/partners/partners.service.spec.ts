import { AuthModule } from './../../auth/auth.module';
import { PartnerDTO } from './../../dto/partner.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { EmailClient } from '@src/helper/email.client';
import { Partner } from '@src/model/partner.entity';
import { PartnerReferral } from '@src/model/partnerReferrals.entity';
import { Repository } from 'typeorm';
import { PartnersService } from './partners.service';
import { PartnerSendCouponDTO } from '@src/dto/partnerSendCoupon.dto';
import { CouponInfoDTO } from '@src/dto/couponInfo.dto';
import { BadRequestException } from '@nestjs/common';

describe('PartnersService', () => {
  let service: PartnersService;
  let partnerRepo: Repository<Partner>;
  let emailClient: EmailClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([PartnerReferral, Partner]),
        AuthModule,
      ],
      providers: [PartnersService, EmailClient],
    }).compile();

    service = module.get<PartnersService>(PartnersService);
    partnerRepo = module.get(getRepositoryToken(Partner));
    emailClient = module.get<EmailClient>(EmailClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    let partners: Partner[];

    beforeAll(async () => {
      partners = await setup();
    });

    it('should get the correct partner', async () => {
      const gotPartner = await service.getById(partners[0].id);
      expect(gotPartner).toBeTruthy();
      expect(gotPartner.id).toEqual(partners[0].id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getByEmail', () => {
    let partners: Partner[];

    beforeAll(async () => {
      partners = await setup();
    });

    it('should get the correct partner', async () => {
      const gotPartner = await service.getByEmail(partners[0].email);
      expect(gotPartner).toBeTruthy();
      expect(gotPartner.id).toEqual(partners[0].id);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await setup();
    });

    it('should get the all partners', async () => {
      const gotPartner = await service.getAll();
      expect(gotPartner.length).toEqual(2);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('count', () => {
    beforeAll(async () => {
      await setup();
    });

    it('should get the correct count when no params are passed', async () => {
      expect(await service.count(new PaginatedDTO())).toEqual(2);
    });

    it('should get correct count when start is given', async () => {
      const count = await service.count(
        new PaginatedDTO({
          start: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(count).toEqual(1);
    });

    it('should return correct count when start and end are given', async () => {
      const count = await service.count(
        new PaginatedDTO({
          start: new Date('2022-01-05 10:35:00+00'),
          end: new Date('2022-01-05 22:35:00+00'),
        }),
      );
      expect(count).toEqual(1);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('create', () => {
    it('should successfully create a partner', async () => {
      const createdPartner = await service.create(
        null,
        new PartnerDTO({
          companyName: 'Test',
          email: 'test@test.com',
          totalCredits: 500,
          phone: '8015555555',
        }),
      );
      expect(createdPartner).toBeTruthy();
      expect(createdPartner.id).toBeTruthy();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('sendCoupon', () => {
    let partners: Partner[];

    beforeAll(async () => {
      partners = await setup();
    });

    it('should return an error if hours is more than total credits', async () => {
      expect(async () => {
        await service.sendCoupon(
          null,
          new PartnerSendCouponDTO({
            partnerId: partners[1].id,
            couponInfo: new CouponInfoDTO({
              hours: 51,
            }),
          }),
        );
      }).rejects.toEqual(new BadRequestException('Insufficient Hours'));
    });

    it('should subtract the partner total credits', async () => {
      jest
        .spyOn(emailClient, 'sendWholeSaleCouponEmail')
        .mockImplementation(async () => {
          return;
        });

      await service.sendCoupon(
        null,
        new PartnerSendCouponDTO({
          partnerId: partners[1].id,
          isWholesale: true,
          couponInfo: new CouponInfoDTO({
            hours: 10,
          }),
        }),
      );

      const updatedPartner = await partnerRepo.findOne({ id: partners[1].id });
      expect(updatedPartner.totalCredits).toEqual(
        partners[1].totalCredits - 10,
      );
    });

    it('should send wholesale email if isWholesale is true', async () => {
      jest
        .spyOn(emailClient, 'sendWholeSaleCouponEmail')
        .mockImplementation(async () => {
          return;
        });

      jest
        .spyOn(emailClient, 'sendCouponEmail')
        .mockImplementation(async () => {
          return;
        });

      await service.sendCoupon(
        null,
        new PartnerSendCouponDTO({
          partnerId: partners[1].id,
          isWholesale: true,
          couponInfo: new CouponInfoDTO({
            hours: 10,
          }),
        }),
      );

      expect(emailClient.sendWholeSaleCouponEmail).toHaveBeenCalled();
      expect(emailClient.sendCouponEmail).not.toHaveBeenCalled();
    });

    it('should send normal email if isWholesale is false', async () => {
      jest
        .spyOn(emailClient, 'sendWholeSaleCouponEmail')
        .mockImplementation(async () => {
          return;
        });

      jest
        .spyOn(emailClient, 'sendCouponEmail')
        .mockImplementation(async () => {
          return;
        });

      await service.sendCoupon(
        null,
        new PartnerSendCouponDTO({
          partnerId: partners[1].id,
          isWholesale: false,
          couponInfo: new CouponInfoDTO({
            hours: 10,
          }),
        }),
      );

      expect(emailClient.sendWholeSaleCouponEmail).not.toHaveBeenCalled();
      expect(emailClient.sendCouponEmail).toHaveBeenCalled();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const setup = async () => {
    const createdPartners = [
      await partnerRepo.save(
        new Partner({
          companyName: 'Test',
          email: 'test@test.com',
          totalCredits: 500,
          phone: '8015555555',
          creationDate: new Date('2022-01-05 18:35:00+00'),
        }),
      ),
      await partnerRepo.save(
        new Partner({
          companyName: 'Test2',
          email: 'test2@test.com',
          totalCredits: 50,
          phone: '8015555556',
          creationDate: new Date('2022-01-06 18:35:00+00'),
        }),
      ),
    ];

    return createdPartners;
  };

  const cleanUp = async () => {
    const partners = await partnerRepo.find();
    for (const partner of partners) {
      await partnerRepo.delete({ id: partner.id });
    }
  };
});
