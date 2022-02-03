import { Lifter, PlaidInfo } from '@src/model/lifters.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/user.decorator';
import { AxiosResponse } from 'axios';
import {
  Configuration,
  CountryCode,
  LinkTokenCreateRequest,
  LinkTokenCreateResponse,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid';
import { Repository } from 'typeorm';

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

  public async createLinkToken(user: User) {
    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: user.sub,
      },
      client_name: 'Welift',
      products: [Products.Auth],
      language: 'en',
      country_codes: [CountryCode.Us],
    };

    const createTokenResponse: AxiosResponse<LinkTokenCreateResponse> =
      await this.client.linkTokenCreate(request);

    return createTokenResponse.data;
  }

  public async exchangePublicToken(
    user: User,
    body: { public_token: string },
  ): Promise<void> {
    const token = body.public_token;

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
