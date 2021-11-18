import { Body, Controller, Post } from '@nestjs/common';
import { PartnerCreditHourPurchaseDTO } from 'src/dto/partnerCreditHourPurchase.dto';
import { User } from 'src/user.decorator';
import { PartnerCreditHourPurchasesService } from './partner-credit-hour-purchases.service';

@Controller('partner-credit-hour-purchases')
export class PartnerCreditHourPurchasesController {
  constructor(private serv: PartnerCreditHourPurchasesService) {}

  @Post('/create-purchase')
  public async createPurchase(
    @User() user: User,
    @Body() body: PartnerCreditHourPurchaseDTO,
  ): Promise<void> {
    this.serv.createPurchase(user, body);
  }
}
