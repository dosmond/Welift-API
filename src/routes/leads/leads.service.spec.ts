import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { LeadUpdateDTO } from './../../dto/lead.update.dto';
import { LeadLandingDTO } from '@src/dto/lead.landing.dto';
import {
  ThumbtackRequest,
  ThumbtackLocation,
  ThumbtackCustomer,
  ThumbtackBusiness,
} from './../../dto/lead.thumbtack.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { LeadThumbtackDTO } from '@src/dto/lead.thumbtack.dto';
import { Order } from '@src/enum/order.enum';
import { EmailClient } from '@src/helper/email.client';
import { SlackHelper } from '@src/helper/slack.helper';
import { Lead } from '@src/model/leads.entity';
import { Repository } from 'typeorm';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { AddressDTO } from '@src/dto/address.dto';

describe('LeadsService', () => {
  let service: LeadsService;
  let leadRepo: Repository<Lead>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Lead]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      controllers: [LeadsController],
      providers: [LeadsService, SlackHelper, EmailClient],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    leadRepo = module.get(getRepositoryToken(Lead));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    let leads: Lead[];

    beforeEach(async () => {
      leads = await createLeads();
    });

    it('should return the correct lead', async () => {
      const lead = await service.getById(leads[0].id);
      expect(lead.id).toEqual(leads[0].id);
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('getAll', () => {
    let leads: Lead[];

    beforeEach(async () => {
      leads = await createLeads();
    });

    it('should getAllLeads when no params are passed', async () => {
      const foundLeads = await service.getAll(new PaginatedDTO());
      expect(foundLeads.length).toEqual(leads.length);
    });

    it('should get the correct leads when only a start is passed in', async () => {
      const foundLeads = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 20:35:00+00'),
        }),
      );

      expect(foundLeads.length).toEqual(1);
    });

    it('should get the correct leads when only a start and end is passed in', async () => {
      const foundLeads = await service.getAll(
        new PaginatedDTO({
          start: new Date('2022-01-05 20:35:00+00'),
          end: new Date('2022-01-05 22:35:00+00'),
        }),
      );

      expect(foundLeads.length).toEqual(0);
    });

    it('should return the leads in the correct order: Default (DESC)', async () => {
      const foundLeads = await service.getAll(new PaginatedDTO());

      expect(
        foundLeads[0].creationDate > foundLeads[1].creationDate,
      ).toBeTruthy();
    });

    it('should return the leads in the correct order (ASC)', async () => {
      const foundLeads = await service.getAll(
        new PaginatedDTO({
          order: Order.ASC,
        }),
      );

      expect(
        foundLeads[0].creationDate < foundLeads[1].creationDate,
      ).toBeTruthy();
    });

    it('should return correct pages', async () => {
      const foundLeadsOne = await service.getAll(
        new PaginatedDTO({
          page: 1,
          pageSize: 1,
        }),
      );

      expect(foundLeadsOne.length).toEqual(1);

      const foundLeadsTwo = await service.getAll(
        new PaginatedDTO({
          page: 2,
          pageSize: 1,
        }),
      );

      expect(foundLeadsTwo.length).toEqual(1);
      expect(foundLeadsOne[0].id).not.toEqual(foundLeadsTwo[0].id);
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('count', () => {
    let leads: Lead[];

    beforeEach(async () => {
      leads = await createLeads();
    });

    it('should get all lead count when no params are passed', async () => {
      const count = await service.count(new PaginatedDTO());
      expect(count).toEqual(leads.length);
    });

    it('should get the correct count when only a start is passed in', async () => {
      const count = await service.count(
        new PaginatedDTO({
          start: new Date('2022-01-05 20:35:00+00'),
        }),
      );

      expect(count).toEqual(1);
    });

    it('should get the correct count when only a start and end is passed in', async () => {
      const count = await service.count(
        new PaginatedDTO({
          start: new Date('2022-01-05 20:35:00+00'),
          end: new Date('2022-01-05 22:35:00+00'),
        }),
      );

      expect(count).toEqual(0);
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('createThumbtack', () => {
    it('should sucessfully create a lead from a thumbtack webhook', async () => {
      const thumbtackLead = new LeadThumbtackDTO({
        leadID: 'test',
        createTimestamp: 'test',
        request: new ThumbtackRequest({
          category: 'test',
          title: 'test',
          description: 'test',
          schedule: 'test',
          location: new ThumbtackLocation({
            city: 'South Jordan',
            state: 'Utah',
            zipCode: '84009',
          }),
        }),
        customer: new ThumbtackCustomer({
          name: 'Test Tester',
          phone: '8015555555',
        }),
        business: new ThumbtackBusiness({
          name: 'Test Business',
        }),
      });

      const lead = await service.createThumbtack(thumbtackLead);

      expect(lead.description).toEqual(thumbtackLead.request.description);
      expect(lead.state).toEqual(thumbtackLead.request.location.state);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('createLanding', () => {
    it('should sucessfully create a lead from the landing page', async () => {
      const landingLead = new LeadLandingDTO({
        name: 'Test Tester',
        email: 'test@test.com',
        phone: '8015555555',
        acquisitionChannel: 'billboard',
        address: new AddressDTO({
          street: '123 N Main St',
          city: 'South Jordan',
          state: 'Utah',
          postalCode: '84009',
        }),
      });

      const lead = await service.createLanding(landingLead);

      expect(lead.name).toEqual(landingLead.name);
      expect(lead.email).toEqual(landingLead.email);
      expect(lead.phone).toEqual(landingLead.phone);
      expect(lead.acquisitionChannel).toEqual(landingLead.acquisitionChannel);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('update', () => {
    let leads: Lead[];

    beforeEach(async () => {
      leads = await createLeads();
    });

    it('should return the correct lead', async () => {
      const leadToUpdate = LeadUpdateDTO.fromEntity(leads[0]);
      leadToUpdate.name = 'Updated Name';
      await service.update(leadToUpdate);
      const lead = await leadRepo.findOne({ id: leadToUpdate.id });
      expect(lead.name).toEqual(leadToUpdate.name);
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  const createLeads = async () => {
    return [
      await leadRepo.save(
        new Lead({
          city: 'South Jordan',
          state: 'Utah',
          postalCode: '84009',
          name: 'Test Tester',
          phone: '8015555555',
          street: '123 N Main St',
          email: 'test@test.com',
          acquisitionChannel: 'thumbtack',
          creationDate: new Date('2022-01-05 18:35:00+00'),
        }),
      ),

      await leadRepo.save(
        new Lead({
          city: 'South Jordan',
          state: 'Utah',
          postalCode: '84009',
          name: 'Test2 Tester',
          phone: '8015555555',
          street: '123 N Main St',
          email: 'test2@test.com',
          acquisitionChannel: 'billboard',
          creationDate: new Date('2022-01-06 18:35:00+00'),
        }),
      ),
    ];
  };

  const cleanUp = async () => {
    const leads = await leadRepo.find();
    for (const lead of leads) {
      await leadRepo.delete({ id: lead.id });
    }
  };
});
