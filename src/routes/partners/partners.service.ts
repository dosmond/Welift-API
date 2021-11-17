import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerSendCouponDTO } from 'src/dto/partnerSendCoupon.dto';
import { Partners } from 'src/model/Partners.entity';
import { User } from 'src/user.decorator';
import { Repository } from 'typeorm';

import Stripe from 'stripe';
import { PartnerDTO } from 'src/dto/partner.dto';
import { EmailClient } from 'src/helper/email.client';
import { PartnerUpdateDTO } from 'src/dto/partner.update.dto';
const stripe = new Stripe(process.env.GATSBY_STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partners)
    private readonly repo: Repository<Partners>,
    private emailClient: EmailClient,
  ) {}

  public async getById(id: string): Promise<PartnerDTO> {
    return await this.repo
      .findOne({ id: id })
      .then((partner) => PartnerDTO.fromEntity(partner));
  }

  public async getAll(): Promise<PartnerDTO[]> {
    return await this.repo.find().then((partners) => {
      return partners.map((partner) => PartnerDTO.fromEntity(partner));
    });
  }

  public async getCount(): Promise<number> {
    const query = this.repo
      .createQueryBuilder('partner')
      .select('COUNT(partner)');

    return await query.getRawOne();
  }

  public async addPartner(
    user: User,
    request: PartnerDTO,
  ): Promise<PartnerDTO> {
    const dto = PartnerDTO.from(request);
    return PartnerDTO.fromEntity(await this.repo.save(dto.toEntity(user)));
  }

  public async updatePartner(
    request: PartnerUpdateDTO,
  ): Promise<PartnerUpdateDTO> {
    const dto = PartnerUpdateDTO.from(request);
    const result = PartnerUpdateDTO.fromEntity(
      await this.repo.save(dto.toEntity()),
    );

    return result;
  }

  // router.post('/customer-coupon', auth.requiredWithLogin, async (req, res) => {
  //   let couponInfo = req.body.couponInfo
  //   let result = await DBClient.decreasePartnerHours(req.body.partnerId, couponInfo.hours)
  //   let rollback

  //   if (!result.error) {
  //       if (req.body.isWholesale) {
  //           result = await EmailClient.sendWholeSaleCouponEmail(couponInfo)
  //       } else {
  //           result = await EmailClient.sendCouponEmail(couponInfo)
  //       }

  //       if (result.error) {
  //           rollback = await DBClient.increasePartnerHours(req.body.partnerId, couponInfo.hours)

  //           if (rollback.error)
  //               return eh.handleVitalError(rollback.error, { location: "Customer - Coupon", objects: [req.body] }, res)
  //       }
  //   }

  //   eh.handleApiResultSingle(result, res)
  // })

  // public async sendCoupon(
  //   user: User,
  //   body: PartnerSendCouponDTO,
  // ): Promise<string> {
  //   let rollback

  //   const dto = PartnerSendCouponDTO.from(body);
  //   const result = PartnerDTO.fromEntity(await this.repo.save(dto.toEntity()));

  //   if(isWholesale) {

  //   }
  // }

  public async createCheckoutSession(body: {
    hours: number;
    perHourCost: number;
  }): Promise<string> {
    const { hours, perHourCost } = body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price: process.env.PARTNER_CREDIT_PRICE_ID,
            name: 'Purchase Credit Hours',
            amount: perHourCost * 10,
            quantity: hours,
            currency: 'usd',
          },
        ],
        success_url: `${process.env.PARTNER_FRONTEND}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.PARTNER_FRONTEND}`,
      });

      return session.id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
