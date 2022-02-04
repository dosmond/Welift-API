import {
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@src/auth/roles/roles.decorator';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { Role } from '@src/enum/roles.enum';
import { User } from '@src/user.decorator';
import { BankingService } from './banking.service';

@Controller('banking')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BankingController {
  constructor(private readonly serv: BankingService) {}

  @Post('create-link-token')
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
  @Roles(Role.Lifter)
  public async exchangePublicToken(
    @User() user: User,
    @Body() body: { publicToken: string },
  ) {
    try {
      return await this.serv.exchangePublicToken(user, body);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
