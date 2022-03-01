import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './../../auth/auth.module';
import { LifterTransaction } from '@src/model/lifterTransaction.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { LifterTransactionsService } from './lifter-transactions.service';
import { Address } from '@src/model/addresses.entity';
import { Lifter } from '@src/model/lifters.entity';
import { Repository } from 'typeorm';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { Order } from '@src/enum/order.enum';
import { LifterPaginatedDTO } from '@src/dto/lifter.paginated.dto';
import { LifterTransactionDTO } from '@src/dto/lifterTransaction.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { LifterTransactionUpdateDTO } from '@src/dto/lifterTransaction.update.dto';
import { User } from '@src/user.decorator';

describe('LifterTransactionsService', () => {
  let service: LifterTransactionsService;
  let transactionRepo: Repository<LifterTransaction>;
  let addressRepo: Repository<Address>;
  let lifterRepo: Repository<Lifter>;
  let user: User;
  let nonAdminUser: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([LifterTransaction, Address, Lifter]),
        AuthModule,
        LoggerModule.forRoot(),
      ],
      providers: [LifterTransactionsService],
    }).compile();

    service = module.get<LifterTransactionsService>(LifterTransactionsService);
    transactionRepo = module.get(getRepositoryToken(LifterTransaction));
    addressRepo = module.get(getRepositoryToken(Address));
    lifterRepo = module.get(getRepositoryToken(Lifter));

    user = {
      roles: 'admin',
      sub: '',
      email: '',
    };

    nonAdminUser = {
      roles: 'lifter',
      sub: 'testUUID',
      email: 'test@test.com',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    let transaction: LifterTransaction;

    beforeAll(async () => {
      const { createdTransaction } = await setup();
      transaction = createdTransaction;
    });

    it('should get the correct transaction', async () => {
      expect((await service.getById(transaction.id)).id).toEqual(
        transaction.id,
      );
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getLifterCurrentBalance', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      const { createdLifter } = await setupMultiple();
      lifter = createdLifter;
    });

    it('should return the correct balance', async () => {
      expect(await service.getLifterCurrentBalance(lifter.id)).toEqual(3000);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await setupMultiple();
    });

    it('should get all transactions when no params are given', async () => {
      expect((await service.getAll(new PaginatedDTO())).length).toEqual(2);
    });

    it('should get the correct transactions when start is given', async () => {
      expect(
        (
          await service.getAll(
            new PaginatedDTO({
              start: new Date('2022-01-05 19:35:00+00'),
            }),
          )
        ).length,
      ).toEqual(1);
    });

    it('should get the correct transactions when start and end are given', async () => {
      expect(
        (
          await service.getAll(
            new PaginatedDTO({
              start: new Date('2022-01-05 19:35:00+00'),
              end: new Date('2022-01-06 21:35:00+00'),
            }),
          )
        ).length,
      ).toEqual(1);
    });

    it('should get the transactions in the correct order', async () => {
      expect(
        (
          await service.getAll(
            new PaginatedDTO({
              order: Order.DESC,
            }),
          )
        )[0].remainingBalance,
      ).toEqual(3000);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('getAllByLifter', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      const { createdLifter } = await setupMultiple();
      lifter = createdLifter;
    });

    it('should get all transactions when no params are given', async () => {
      expect(
        (
          await service.getAllByLifter(
            new LifterPaginatedDTO({
              lifterId: lifter.id,
            }),
          )
        ).length,
      ).toEqual(2);
    });

    it('should get the correct transactions when start is given', async () => {
      expect(
        (
          await service.getAllByLifter(
            new LifterPaginatedDTO({
              lifterId: lifter.id,
              start: new Date('2022-01-05 19:35:00+00'),
            }),
          )
        ).length,
      ).toEqual(1);
    });

    it('should get the correct transactions when start and end are given', async () => {
      expect(
        (
          await service.getAllByLifter(
            new LifterPaginatedDTO({
              lifterId: lifter.id,
              start: new Date('2022-01-05 19:35:00+00'),
              end: new Date('2022-01-06 21:35:00+00'),
            }),
          )
        ).length,
      ).toEqual(1);
    });

    it('should get the transactions in the correct order', async () => {
      expect(
        (
          await service.getAllByLifter(
            new LifterPaginatedDTO({
              lifterId: lifter.id,
              order: Order.DESC,
            }),
          )
        )[0].remainingBalance,
      ).toEqual(3000);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('createQuickDeposit', () => {
    let lifter: Lifter;
    let transaction: LifterTransaction;

    beforeEach(async () => {
      const { createdLifter, createdTransaction } = await setup();
      lifter = createdLifter;
      transaction = createdTransaction;
    });

    it('should throw an error if it is not a quick deposit', async () => {
      expect(async () => {
        await service.createQuickDeposit(
          user,
          new LifterTransactionDTO({
            isQuickDeposit: false,
            amount: -1000,
          }),
        );
      }).rejects.toEqual(new BadRequestException('Must be a quick deposit'));
    });

    it('should throw an error if it is there are no previous transactions', async () => {
      await transactionRepo.delete({ id: transaction.id });

      expect(async () => {
        await service.createQuickDeposit(
          user,
          new LifterTransactionDTO({
            lifterId: lifter.id,
            isQuickDeposit: true,
            amount: -1000,
          }),
        );
      }).rejects.toEqual(
        new BadRequestException('Balance is currently 0. Unable to deposit'),
      );
    });

    it('should throw an error if remaining balance is insufficient', async () => {
      expect(async () => {
        await service.createQuickDeposit(
          user,
          new LifterTransactionDTO({
            lifterId: lifter.id,
            isQuickDeposit: true,
            amount: -6000,
          }),
        );
      }).rejects.toEqual(
        new BadRequestException('Remaining Balance is insufficient'),
      );
    });

    it('should throw an error if the user does not match the lifterId', async () => {
      expect(async () => {
        await service.createQuickDeposit(
          nonAdminUser,
          new LifterTransactionDTO({
            lifterId: lifter.id,
            title: 'testDeposit',
            isQuickDeposit: true,
            amount: -1000,
          }),
        );
      }).rejects.toEqual(new ForbiddenException('Forbidden'));
    });

    it('should update the remaining balance correctly', async () => {
      expect(
        (
          await service.createQuickDeposit(
            user,
            new LifterTransactionDTO({
              lifterId: lifter.id,
              title: 'Quick Deposit',
              isQuickDeposit: true,
              amount: -2000,
            }),
          )
        ).remainingBalance,
      ).toEqual(3000);
    });

    afterEach(async () => {
      await cleanUp();
    });
  });

  describe('create', () => {
    let lifter: Lifter;

    beforeAll(async () => {
      const { createdLifter } = await setup();
      lifter = createdLifter;
    });

    it('should update the remaining balance correctly', async () => {
      expect(
        (
          await service.create(
            user,
            new LifterTransactionDTO({
              lifterId: lifter.id,
              title: 'Lift in Salt Lake City',
              isQuickDeposit: false,
              amount: 2000,
            }),
          )
        ).remainingBalance,
      ).toEqual(7000);
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  describe('update', () => {
    let transaction: LifterTransaction;

    beforeAll(async () => {
      const { createdTransaction } = await setup();
      transaction = createdTransaction;
    });

    it('should update the existing transaction', async () => {
      transaction.title = 'updated';
      await service.update(
        new LifterTransactionUpdateDTO({
          id: transaction.id,
          title: transaction.title,
        }),
      );
      const updated = await transactionRepo.findOne({ id: transaction.id });
      expect(updated.title).toEqual(transaction.title);
    });

    it('should throw an error if the given id does not exist', async () => {
      const transactionUpdate = new LifterTransactionUpdateDTO({
        id: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
        title: 'test',
      });

      expect(
        async () => await service.update(transactionUpdate),
      ).rejects.toEqual(new BadRequestException('Transaction does not exist'));
    });

    afterAll(async () => {
      await cleanUp();
    });
  });

  const setup = async () => {
    const createdLifter = await lifterRepo.save(
      new Lifter({
        firstName: 'test',
        lastName: 'test',
        phone: '8015555555',
        passedBc: false,
        bcInProgress: false,
        email: 'test@test.com',
        hasPickupTruck: true,
        status: 'contacted',
        userId: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
        addressId: (
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
      }),
    );

    const createdTransaction = await transactionRepo.save(
      new LifterTransaction({
        lifterId: createdLifter.id,
        date: new Date(),
        title: 'Test',
        remainingBalance: 5000,
        amount: 2000,
        fees: 0,
        isQuickDeposit: false,
      }),
    );

    return { createdTransaction, createdLifter };
  };

  const setupMultiple = async () => {
    const createdLifter = await lifterRepo.save(
      new Lifter({
        firstName: 'test',
        lastName: 'test',
        phone: '8015555555',
        passedBc: false,
        bcInProgress: false,
        email: 'test@test.com',
        hasPickupTruck: true,
        status: 'contacted',
        userId: '7628dfcb-b78c-4435-bf7c-33e7728f6a11',
        addressId: (
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
      }),
    );

    const createdTransactions = [
      await transactionRepo.save(
        new LifterTransaction({
          lifterId: createdLifter.id,
          date: new Date('2022-01-05 18:35:00+00'),
          title: 'Test',
          remainingBalance: 5000,
          amount: 2000,
          fees: 150,
          isQuickDeposit: false,
        }),
      ),
      await transactionRepo.save(
        new LifterTransaction({
          lifterId: createdLifter.id,
          date: new Date('2022-01-06 20:35:00+00'),
          title: 'Test',
          remainingBalance: 3000,
          amount: -2000,
          fees: 150,
          isQuickDeposit: false,
        }),
      ),
    ];

    return { createdTransactions, createdLifter };
  };

  const cleanUp = async () => {
    const transactions = await transactionRepo.find();
    for (const transaction of transactions) {
      await transactionRepo.delete({ id: transaction.id });
    }

    const lifters = await lifterRepo.find();

    for (const lifter of lifters) {
      await lifterRepo.delete({ id: lifter.id });
    }

    const addresses = await addressRepo.find();
    for (const address of addresses) {
      await addressRepo.delete({ id: address.id });
    }
  };
});
