import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { PartnerCreditHourPurchaseDTO } from 'src/dto/partnerCreditHourPurchase.dto';
import { Role } from 'src/enum/roles.enum';
import { User } from 'src/user.decorator';
import { PartnerCreditHourPurchasesService } from './partner-credit-hour-purchases.service';

@Controller('partner-credit-hour-purchases')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PartnerCreditHourPurchasesController {
  constructor(private serv: PartnerCreditHourPurchasesService) {}

  @Post('/create-purchase')
  @Roles(Role.Partner)
  public async createPurchase(
    @User() user: User,
    @Body() body: PartnerCreditHourPurchaseDTO,
  ): Promise<void> {
    this.serv.createPurchase(user, body);
  }
}
