import { IsEnum, IsString } from 'class-validator';
import { AccountIdentityVerificationStatusEnum } from 'plaid';

export class PlaidWebhookDTO implements Readonly<PlaidWebhookDTO> {
  @IsString()
  webhook_type: string;

  @IsEnum(AccountIdentityVerificationStatusEnum)
  webhook_code: AccountIdentityVerificationStatusEnum;

  @IsString()
  item_id: string;

  @IsString()
  account_id: string;

  constructor(init?: Partial<PlaidWebhookDTO>) {
    Object.assign(this, init);
  }
}
