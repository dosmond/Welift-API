import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerSendCouponDTO } from '@src/dto/partnerSendCoupon.dto';
import { Partner } from '@src/model/partner.entity';
import { User } from '@src/user.decorator';
import { Between, FindManyOptions, Repository } from 'typeorm';

import Stripe from 'stripe';
import { PartnerDTO } from '@src/dto/partner.dto';
import { EmailClient } from '@src/helper/email.client';
import { PartnerUpdateDTO } from '@src/dto/partner.update.dto';
import { PartnerCreditCheckoutDTO } from '@src/dto/partnerCreditCheckout.dto';
const stripe = new Stripe(process.env.GATSBY_STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly repo: Repository<Partner>,
    private emailClient: EmailClient,
  ) {}

  public async getById(id: string): Promise<PartnerDTO> {
    return await this.repo
      .findOne({ id: id })
      .then((partner) => PartnerDTO.fromEntity(partner));
  }

  public async getByEmail(email: string): Promise<PartnerDTO> {
    return await this.repo
      .findOne({ email: email })
      .then((partner) => PartnerDTO.fromEntity(partner));
  }

  public async getAll(): Promise<PartnerDTO[]> {
    return await this.repo.find().then((partners) => {
      return partners.map((partner) => PartnerDTO.fromEntity(partner));
    });
  }

  public async count(request: PaginatedDTO): Promise<number> {
    const { start, end } = request;

    const options: FindManyOptions = {};

    // Time Queries
    if (start && end) options.where = { creationDate: Between(start, end) };
    else if (start)
      options.where = { creationDate: Between(start, new Date()) };

    const [, count] = await this.repo.findAndCount(options);
    return count;
  }

  public async create(user: User, request: PartnerDTO): Promise<PartnerDTO> {
    const dto = PartnerDTO.from(request);
    return PartnerDTO.fromEntity(await this.repo.save(dto.toEntity(user)));
  }

  public async updatePartner(
    user: User,
    request: PartnerUpdateDTO,
  ): Promise<PartnerUpdateDTO> {
    const dto = PartnerUpdateDTO.from(request);
    const result = PartnerUpdateDTO.fromEntity(
      await this.repo.save(dto.toEntity(user)),
    );

    return result;
  }

  public async sendCoupon(
    user: User,
    body: PartnerSendCouponDTO,
  ): Promise<void> {
    const sendCouponInfo = PartnerSendCouponDTO.from(body);
    const partner = await this.repo.findOne({ id: sendCouponInfo.partnerId });

    if (partner.totalCredits - sendCouponInfo.couponInfo.hours < 0) {
      throw new BadRequestException('Insufficient Hours');
    }

    partner.totalCredits -= sendCouponInfo.couponInfo.hours;

    await this.repo.save(partner);

    try {
      if (sendCouponInfo.isWholesale) {
        await this.emailClient.sendWholeSaleCouponEmail(
          sendCouponInfo.couponInfo,
        );
      } else {
        await this.emailClient.sendCouponEmail(sendCouponInfo.couponInfo);
      }
    } catch (err) {
      partner.totalCredits += sendCouponInfo.couponInfo.hours;
      await this.repo.save(partner);
      throw err;
    }
  }

  public async createCheckoutSession(
    body: PartnerCreditCheckoutDTO,
  ): Promise<string> {
    const { hours, perHourCost } = body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price: process.env.PARTNER_CREDIT_PRICE_ID,
            name: 'Purchase Credit Hours',
            amount: parseInt(perHourCost) * 10,
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
