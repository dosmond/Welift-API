import { EmailClient } from './../../helper/emailClient';
import { Booking } from './../../model/booking.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { BookingDTO } from 'src/dto/booking.dto';
import { BookingBatchDTO } from 'src/dto/booking.batch.dto';
import { AddressDTO } from 'src/dto/address.dto';

import Stripe from 'stripe'
const stripe = new Stripe(process.env.GATSBY_STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private readonly repo: Repository<Booking>,
    private emailClient: EmailClient
  ) { }

  public async getAll(): Promise<BookingDTO[]> {
    return [new BookingDTO()]
  }

  public async createBatch(batch: BookingBatchDTO): Promise<BookingDTO> {
    const startingAddress = AddressDTO.from(batch.startingAddress)
    const endingAddress = AddressDTO.from(batch.endingAddress)
    let booking = BookingDTO.from(batch.booking)

    const queryRunner = getConnection().createQueryRunner()
    await queryRunner.connect()

    await queryRunner.startTransaction()

    try {
      const starting = await queryRunner.manager.save(startingAddress.toEntity())
      const ending = await queryRunner.manager.save(endingAddress.toEntity())

      booking.startingAddressId = starting.id
      booking.endingAddressId = ending.id

      const result = await queryRunner.manager.save(booking.toEntity())

      // Handle refund if referral code exists
      if (batch.referralCode) {
        let referrerBooking = await this.repo.findOne({ referralCode: batch.referralCode })
        const session = await stripe.checkout.sessions.retrieve(referrerBooking.stripeSessionId)
        const intentId = session.payment_intent

        await stripe.refunds.create({
          payment_intent: intentId.toString(),
          amount: 1500
        })

        await this.emailClient.sendBookingRefundSent(referrerBooking.email)
        referrerBooking.referralCode = 'complete'
        await this.repo.save(referrerBooking)
      }

      queryRunner.commitTransaction()

      return BookingDTO.fromEntity(result)
    }
    catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction()
      throw (err)
    }
  }
}
