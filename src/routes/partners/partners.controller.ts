import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PartnerDTO } from 'src/dto/partner.dto';
import { PartnerUpdateDTO } from 'src/dto/partner.update.dto';
import { PartnerCreditCheckoutDTO } from 'src/dto/partnerCreditCheckout.dto';
import { PartnerSendCouponDTO } from 'src/dto/partnerSendCoupon.dto';
import { User } from 'src/user.decorator';
import { PartnersService } from './partners.service';

@Controller('partner')
export class PartnersController {
  constructor(private serv: PartnersService) {}

  @Get()
  public async getById(@Query() query: { id: string }): Promise<PartnerDTO> {
    try {
      return await this.serv.getById(query.id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  public async getAll(): Promise<PartnerDTO[]> {
    return await this.serv.getAll();
  }

  @Get('count')
  public async getCount(): Promise<number> {
    return await this.serv.getCount();
  }

  @Post('create')
  public async addPartner(
    @User() user: User,
    @Body() body: PartnerDTO,
  ): Promise<PartnerDTO> {
    return await this.serv.addPartner(user, body);
  }

  @Put('update')
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
  public async createCheckoutSession(
    @Body()
    body: PartnerCreditCheckoutDTO,
  ): Promise<string> {
    return await this.serv.createCheckoutSession(body);
  }
}
