import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@src/auth/roles/roles.decorator';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { PartnerDTO } from '@src/dto/partner.dto';
import { PartnerUpdateDTO } from '@src/dto/partner.update.dto';
import { PartnerCreditCheckoutDTO } from '@src/dto/partnerCreditCheckout.dto';
import { PartnerSendCouponDTO } from '@src/dto/partnerSendCoupon.dto';
import { Role } from '@src/enum/roles.enum';
import { User } from '@src/user.decorator';
import { PartnersService } from './partners.service';

@Controller('partner')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PartnersController {
  constructor(private serv: PartnersService) {}

  @Get()
  @Roles(Role.Partner)
  public async getById(
    @Query() query: { id: string; email: string },
  ): Promise<PartnerDTO> {
    try {
      if (query.id) return await this.serv.getById(query.id);
      if (query.email) return await this.serv.getByEmail(query.email);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  @Roles(Role.Admin)
  public async getAll(): Promise<PartnerDTO[]> {
    return await this.serv.getAll();
  }

  @Get('count')
  @Roles(Role.Admin)
  public async count(@Query() query: PaginatedDTO): Promise<number> {
    try {
      return await this.serv.count(query);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create')
  @Roles(Role.Admin)
  public async addPartner(
    @User() user: User,
    @Body() body: PartnerDTO,
  ): Promise<PartnerDTO> {
    return await this.serv.addPartner(user, body);
  }

  @Put('update')
  @Roles(Role.Partner)
  public async updatePartner(
    @User() user: User,
    @Body() request: PartnerUpdateDTO,
  ): Promise<PartnerUpdateDTO> {
    try {
      return await this.serv.updatePartner(user, request);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('send-coupon')
  @Roles(Role.Partner)
  public async sendCoupon(
    @User() user: User,
    @Body() body: PartnerSendCouponDTO,
  ): Promise<void> {
    try {
      return await this.serv.sendCoupon(user, body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('create-checkout-session')
  @Roles(Role.Partner)
  public async createCheckoutSession(
    @Body()
    body: PartnerCreditCheckoutDTO,
  ): Promise<string> {
    return await this.serv.createCheckoutSession(body);
  }
}
