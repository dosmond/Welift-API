import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PartnerDTO } from 'src/dto/partner.dto';
import { PartnerSendCouponDTO } from 'src/dto/partnerSendCoupon.dto';
import { User } from 'src/user.decorator';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(private serv: PartnersService) {}

  @Get()
  public async getById(@Query() query: { id: string }): Promise<PartnerDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('list')
  public async getAll(): Promise<PartnerDTO[]> {
    return await this.serv.getAll();
  }

  @Get('count')
  public async getCount(): Promise<number> {
    return await this.serv.getCount();
  }

  @Post('add-partner')
  public async addPartner(
    @User() user: User,
    @Body() body: PartnerDTO,
  ): Promise<PartnerDTO> {
    return await this.serv.addPartner(user, body);
  }

  @Post('send-coupon')
  public async sendCoupon(
    @User() user: User,
    @Body() body: PartnerSendCouponDTO,
  ): Promise<PartnerDTO> {
    return await this.serv.sendCoupon(user, body);
  }

  @Post('create-checkout-session')
  public async createCheckoutSession(
    @Body()
    body: {
      hours: number;
      perHourCost: number;
    },
  ): Promise<string> {
    return await this.serv.createCheckoutSession(body);
  }
}
