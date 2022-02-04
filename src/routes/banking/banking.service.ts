import { Lifter, PlaidInfo } from '@src/model/lifters.entity';
import {
  ForbiddenException,
  Injectable,
  BadRequestException,
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
  Products,
} from 'plaid';
import { Repository } from 'typeorm';
import { Role } from '@src/enum/roles.enum';

@Injectable()
export class BankingService {
  private readonly client: PlaidApi;

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
    body: { publicToken: string },
  ): Promise<void> {
    const token = body.publicToken;

    const response = await this.client.itemPublicTokenExchange({
      public_token: token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Save item and access token info in the lifter.
    const lifter = await this.lifterRepo.findOne({ userId: user.sub });
    const updateLifter = new Lifter({
      id: lifter.id,
      plaidInfo: new PlaidInfo({
        accessToken: accessToken,
        itemId: itemId,
        hasLinkedBankAccount: true,
      }),
    });

    await this.lifterRepo.save(updateLifter);
  }
}
