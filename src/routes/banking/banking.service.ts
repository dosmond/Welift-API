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

const stripe = new Stripe(process.env.GATSBY_STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

@Injectable()
export class BankingService {
  private readonly client: PlaidApi;
  private readonly logger: Logger = new Logger(BankingService.name);

  constructor(
    @InjectRepository(Lifter) private readonly lifterRepo: Repository<Lifter>,
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
    user: User,
    body: {
      lifterId: string;
      publicToken: string;
      accountId: string;
      dob: string;
      ssnLastFour: string;
      hasStripeAccount: boolean;
    },
  ): Promise<void> {
    const token = body.publicToken;
    const accountId = body.accountId;
    const hasStripeAccount = body.hasStripeAccount;
    const lifterId = body.lifterId;

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
          address: {
            line1: lifter.address.street,
            city: lifter.address.city,
            postal_code: lifter.address.postalCode,
            state: lifter.address.state,
          },
          email: lifter.email,
          phone: lifter.phone,
          ssn_last_4: body.ssnLastFour,
          dob: {
            day: dob.date(),
            month: dob.month(),
            year: dob.year(),
          },
        },
        external_account: stripeTokenResponse.data.stripe_bank_account_token,
        business_profile: {
          url: 'https://getwelift.com',
        },
      });

      updateLifter.plaidInfo.stripeBankAccountId = account.id;
    }

    await this.lifterRepo.save(updateLifter);
  }

  public async payoutLifter(user: User, request: { lifterId: string }) {
    const lifter = await this.lifterRepo.findOne({ id: request.lifterId });

    // Can only get your own info unless you are an admin
    if (!user.roles.split(',').includes(Role.Admin)) {
      if (user.sub !== lifter.userId) {
        throw new ForbiddenException('Forbidden');
      }
    }

    const token = await stripe.accounts.retrieve();

    console.log(token);

    // const transfer = await stripe.transfers.create({
    //   amount: 1000,
    //   currency: 'usd',
    //   destination: token.bank_account.id,
    // });

    // console.log(transfer);
  }
}
