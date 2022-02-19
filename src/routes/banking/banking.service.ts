import { LifterTransactionsService } from './../lifter-transactions/lifter-transactions.service';
import { PayoutEvent } from './../../events/payout.event';
import { EventNames } from './../../enum/eventNames.enum';
import { Lifter, PlaidInfo } from '@src/model/lifters.entity';
import {
  ForbiddenException,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/user.decorator';
import { AxiosResponse } from 'axios';
import {
  AccountBase,
  AccountsGetRequest,
  Configuration,
  CountryCode,
  Institution,
  InstitutionsGetByIdRequest,
  LinkTokenCreateRequest,
  LinkTokenCreateResponse,
  PlaidApi,
  PlaidEnvironments,
  ProcessorStripeBankAccountTokenCreateRequest,
  Products,
} from 'plaid';
import { Repository } from 'typeorm';
import { Role } from '@src/enum/roles.enum';
import Stripe from 'stripe';
import dayjs from 'dayjs';
import { Request } from 'express';
import { OnEvent } from '@nestjs/event-emitter';
import { LifterTransactionDTO } from '@src/dto/lifterTransaction.dto';
import { PlaidWebhookDTO } from '@src/dto/plaidWebhook.dto';

const stripe = new Stripe(process.env.GATSBY_STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

@Injectable()
export class BankingService {
  private readonly client: PlaidApi;
  private readonly logger: Logger = new Logger(BankingService.name);

  constructor(
    @InjectRepository(Lifter) private readonly lifterRepo: Repository<Lifter>,
    private readonly transactionService: LifterTransactionsService,
  ) {
    const configuration: Configuration = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
          'Plaid-Version': '2020-09-14',
        },
      },
    });

    this.client = new PlaidApi(configuration);
  }

  public async getLifterAccount(
    user: User,
    lifterId: string,
  ): Promise<{
    accounts: AccountBase[];
    institution: Institution;
  }> {
    const lifter = await this.lifterRepo.findOne({ id: lifterId });

    // Can only get your own info unless you are an admin
    if (!user.roles.split(',').includes(Role.Admin)) {
      if (user.sub !== lifter.userId) {
        throw new ForbiddenException('Forbidden');
      }
    }

    if (!lifter?.plaidInfo?.accessToken) {
      throw new BadRequestException('Bank account must first be linked');
    }

    const request: AccountsGetRequest = {
      access_token: lifter.plaidInfo.accessToken,
    };

    const accountsResponse = await this.client.accountsGet(request);

    const institutionRequest: InstitutionsGetByIdRequest = {
      institution_id: accountsResponse.data.item.institution_id,
      country_codes: [CountryCode.Us],
      options: {
        include_optional_metadata: true,
      },
    };

    const institutionResponse = await this.client.institutionsGetById(
      institutionRequest,
    );

    return {
      accounts: accountsResponse.data.accounts,
      institution: institutionResponse.data.institution,
    };
  }

  public async createLinkToken(user: User, isAndroid: boolean) {
    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: user.sub,
      },
      client_name: 'Welift',
      products: [Products.Auth],
      language: 'en',
      country_codes: [CountryCode.Us],
    };

    if (isAndroid) request.android_package_name = 'com.welift.lifterapp';

    const createTokenResponse: AxiosResponse<LinkTokenCreateResponse> =
      await this.client.linkTokenCreate(request);

    return createTokenResponse.data;
  }

  public async exchangePublicToken(
    req: Request,
    user: User,
    body: {
      lifterId: string;
      publicToken: string;
      accountId: string;
      dob: string;
      ssn: string;
      hasStripeAccount: boolean;
    },
  ): Promise<void> {
    const token = body.publicToken;
    const accountId = body.accountId;
    const hasStripeAccount = body.hasStripeAccount;
    const lifterId = body.lifterId;
    const ssn = body.ssn;
    const ssnLastFour = ssn.substring(ssn.length - 4);

    const lifter = await this.lifterRepo.findOne(
      { id: lifterId },
      { relations: ['address'] },
    );

    // Can only get your own info unless you are an admin
    if (!user.roles.split(',').includes(Role.Admin)) {
      if (user.sub !== lifter.userId) {
        throw new ForbiddenException('Forbidden');
      }
    }

    const response = await this.client.itemPublicTokenExchange({
      public_token: token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Generate a bank account token
    const stripeRequest: ProcessorStripeBankAccountTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountId,
    };
    const stripeTokenResponse =
      await this.client.processorStripeBankAccountTokenCreate(stripeRequest);

    this.logger.warn(stripeTokenResponse.data);

    // Save item and access token info in the lifter.
    const updateLifter = new Lifter({
      id: lifter.id,
      plaidInfo: new PlaidInfo({
        accessToken: accessToken,
        itemId: itemId,
        hasLinkedBankAccount: true,
        stripeBankAccountId: accountId,
        stripeBankAccountToken:
          stripeTokenResponse.data.stripe_bank_account_token,
      }),
    });

    if (!hasStripeAccount) {
      const dob = dayjs(body.dob);

      const account = await stripe.accounts.create({
        type: 'custom',
        country: 'US',
        email: lifter.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
          first_name: lifter.firstName,
          last_name: lifter.lastName,
          address: {
            line1: lifter.address.street,
            city: lifter.address.city,
            postal_code: lifter.address.postalCode,
            state: lifter.address.state,
          },
          email: lifter.email,
          phone: lifter.phone,
          ssn_last_4: ssnLastFour,
          id_number: ssn,
          dob: {
            day: dob.date(),
            month: dob.month() + 1,
            year: dob.year(),
          },
        },
        tos_acceptance: {
          date: Math.round(new Date().getTime() / 1000),
          ip: (req.headers['x-forwarded-for'] as string).split(',')[0],
        },
        external_account: stripeTokenResponse.data.stripe_bank_account_token,
        business_profile: {
          url: 'https://getwelift.com',
          mcc: '4214',
        },
      });

      updateLifter.plaidInfo.stripeBankAccountId = account.id;
    }

    await this.lifterRepo.save(updateLifter);
  }

  public async payoutLifter(
    user: User,
    request: { lifterId: string; amount: number },
  ) {
    const lifter = await this.lifterRepo.findOne({ id: request.lifterId });

    // Can only get your own info unless you are an admin
    if (!user.roles.split(',').includes(Role.Admin)) {
      if (user.sub !== lifter.userId) {
        throw new ForbiddenException('Forbidden');
      }
    }

    await this.createTransfer(
      new PayoutEvent({
        title: 'Quick Deposit',
        amount: request.amount,
        lifter: lifter,
        isQuickDeposit: true,
        fees: Math.abs(Math.round(request.amount * 0.015)),
      }),
    );
  }

  public async plaidWebhook(event: PlaidWebhookDTO) {
    console.log(event);
  }

  private async createTransfer(event: PayoutEvent) {
    const remainingBalance =
      await this.transactionService.getLifterCurrentBalance(event.lifter.id);

    if (Math.abs(event.amount) > remainingBalance) {
      throw new BadRequestException(
        `Unable to process transfer for lifter: ${
          event.lifter.id
        }. Remaining balance is insufficient for the requested amount ($${Math.abs(
          event.amount / 100,
        )}). Remaining Balance: $${remainingBalance / 100}`,
      );
    }

    const newTransaction = await this.transactionService.createStandardDeposit(
      new LifterTransactionDTO({
        title: event.title,
        amount: event.amount,
        lifterId: event.lifter.id,
        fees: event.fees,
        isQuickDeposit: event.isQuickDeposit,
      }),
    );

    try {
      await stripe.transfers.create({
        amount: Math.abs(event.amount) - event.fees,
        currency: 'usd',
        destination: event.lifter.plaidInfo.stripeBankAccountId,
      });
    } catch (err) {
      // There was en error on stripe side. We need to remove the created transaction!
      await this.transactionService.delete(newTransaction.id);
      this.logger.error(err);
      throw new BadRequestException(err);
    }
  }

  @OnEvent(EventNames.Payout)
  private async payoutAllLifters() {
    const lifters = await this.lifterRepo
      .createQueryBuilder('q')
      .where('q.plaidInfo ::jsonb @> :hasLinked', {
        hasLinked: {
          hasLinkedBankAccount: true,
        },
      })
      .getMany();

    const promises: Promise<void>[] = [];
    lifters.forEach((lifter) => {
      promises.push(
        new Promise(async () => {
          try {
            const remainingBalance =
              await this.transactionService.getLifterCurrentBalance(lifter.id);

            if (remainingBalance) {
              await this.createTransfer(
                new PayoutEvent({
                  title: 'Standard Deposit',
                  amount: -remainingBalance,
                  fees: 0.0,
                  isQuickDeposit: false,
                  lifter: lifter,
                }),
              );
            }
          } catch (err) {
            this.logger.error(
              `Error during automatic payment for lifter: ${lifter.id} ----> ${err.message}`,
            );
          }
        }),
      );
    });

    // Let everything keep running. We just need to log if there are errors.
    await Promise.allSettled(promises);
  }
}
