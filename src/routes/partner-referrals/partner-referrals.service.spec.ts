import { AuthModule } from './../../auth/auth.module';
import { Booking } from '@src/model/booking.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PartnerReferral } from '@src/model/partnerReferrals.entity';
import { PartnerReferralsService } from './partner-referrals.service';
import { Partner } from '@src/model/partner.entity';
import { Repository } from 'typeorm';
import { Address } from '@src/model/addresses.entity';
import { PartnerReferralDTO } from '@src/dto/partnerReferral.dto';

describe('PartnerReferralsService', () => {
  let service: PartnerReferralsService;
  let partnerRepo: Repository<Partner>;
  let bookingRepo: Repository<Booking>;
  let referralRepo: Repository<PartnerReferral>;
  let addressRepo: Repository<Address>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([PartnerReferral, Partner, Booking, Address]),
        AuthModule,
      ],
      providers: [PartnerReferralsService],
    }).compile();

    service = module.get<PartnerReferralsService>(PartnerReferralsService);
    partnerRepo = module.get(getRepositoryToken(Partner));
    bookingRepo = module.get(getRepositoryToken(Booking));
    referralRepo = module.get(getRepositoryToken(PartnerReferral));
    addressRepo = module.get(getRepositoryToken(Address));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addPartnerReferral', () => {
    let partner: Partner;
    let booking: Booking;

    beforeAll(async () => {
      const { createdPartner, createdBooking } = await setup();
      partner = createdPartner;
      booking = createdBooking;
    });

    it('should add a new referral', async () => {
      const createdReferral = await service.addPartnerReferral(
        null,
        new PartnerReferralDTO({
          partnerId: partner.id,
          bookingId: booking.id,
        }),
      );

      expect(createdReferral).toBeTruthy();
      expect(createdReferral.id).toBeTruthy();
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const setup = async () => {
    const createdPartner = await partnerRepo.save(
      new Partner({
        companyName: 'Test',
        email: 'test@test.com',
        totalCredits: 500,
        phone: '8015555555',
      }),
    );

    const createdBooking = await bookingRepo.save(
      new Booking({
        needsPickupTruck: true,
        name: `test-booking2`,
        phone: '8015555555',
        email: 'test@test.com',
        startingAddressId: (
          await addressRepo.save(
            new Address({
              street: 'test1',
              street2: 'test1',
              city: 'city',
              state: 'state',
              postalCode: 'postalCode',
            }),
          )
        ).id,
        endingAddressId: (
          await addressRepo.save(
            new Address({
              street: 'test1',
              street2: 'test1',
              city: 'city',
              state: 'state',
              postalCode: 'postalCode',
            }),
          )
        ).id,
        startTime: new Date('2022-01-05 18:35:00+00'),
        endTime: new Date('2022-01-05 20:35:00+00'),
        lifterCount: 1,
        hoursCount: 2,
        totalCost: 240,
        timezone: 'America/Denver',
        distanceInfo: 'none',
      }),
    );

    return { createdPartner, createdBooking };
  };

  const cleanUp = async () => {
    const referrals = await referralRepo.find();
    for (const referral of referrals) {
      await referralRepo.delete({ id: referral.id });
    }

    const bookings = await bookingRepo.find();
    for (const booking of bookings) {
      await bookingRepo.delete({ id: booking.id });
    }

    const partners = await partnerRepo.find();
    for (const partner of partners) {
      await partnerRepo.delete({ id: partner.id });
    }

    const addresses = await addressRepo.find();
    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }
  };
});
