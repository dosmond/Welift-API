import {
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Body,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@src/auth/roles/roles.decorator';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { PlaidWebhookDTO } from '@src/dto/plaidWebhook.dto';
import { Role } from '@src/enum/roles.enum';
import { User } from '@src/user.decorator';
import { Request } from 'express';
import { AccountBase, Institution } from 'plaid';
import { BankingService } from './banking.service';

@Controller('banking')
export class BankingController {
  constructor(private readonly serv: BankingService) {}

  @Get('account')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Lifter)
  public async getLifterAccount(
    @User() user: User,
    @Query() query: { lifterId: string },
  ): Promise<{
    accounts: AccountBase[];
    institution: Institution;
  }> {
    try {
      return await this.serv.getLifterAccount(user, query.lifterId);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('create-link-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Lifter)
  public async createLinkToken(
    @User() user: User,
    @Body() body: { isAndroid: boolean },
  ) {
    try {
      return await this.serv.createLinkToken(user, body.isAndroid);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('exchange-public-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Lifter)
  public async exchangePublicToken(
    @Req() req: Request,
    @User() user: User,
    @Body()
    body: {
      lifterId: string;
      publicToken: string;
      accountId: string;
      dob: string;
      ssn: string;
      hasStripeAccount: boolean;
    },
  ) {
    try {
      return await this.serv.exchangePublicToken(req, user, body);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('payout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Lifter)
  public async payoutLifter(
    @User() user: User,
    @Body() body: { lifterId: string; amount: number },
  ) {
    try {
      return await this.serv.payoutLifter(user, body);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('plaid-webhook')
  public async plaidWebhook(@Body() body: PlaidWebhookDTO) {
    try {
      return await this.serv.plaidWebhook(body);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
