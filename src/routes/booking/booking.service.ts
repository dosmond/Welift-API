import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { EmailClient } from './../../helper/emailClient';
import { Booking } from './../../model/booking.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository, Between, FindManyOptions } from 'typeorm';
import { BookingDTO } from 'src/dto/booking.dto';
import { BookingBatchDTO } from 'src/dto/booking.batch.dto';
import { AddressDTO } from 'src/dto/address.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const words = require('random-words');

import Stripe from 'stripe';
import { Lift } from 'src/model/lifts.entity';
const stripe = new Stripe(process.env.GATSBY_STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private readonly repo: Repository<Booking>,
    private emailClient: EmailClient,
  ) {}

  public async getById(id: string): Promise<BookingDTO> {
    return BookingDTO.fromEntity(
      await this.repo.findOne(
        { id: id },
        { relations: ['startingAddress', 'endingAddress', 'lift', 'notes'] },
      ),
    );
  }

  public async getAll(request: PaginatedDTO): Promise<BookingDTO[]> {
    const { start, end, page, pageSize, order } = request;

    const options: FindManyOptions = {
      relations: ['startingAddress', 'endingAddress', 'lift', 'notes'],
    };

    // Time Queries
    if (start && end) options.where = { startTime: Between(start, end) };
    else if (start) options.where = { startTime: Between(start, new Date()) };

    options.order = { startTime: order };

    // Pagination
    if (page && pageSize) {
      options.skip = (page - 1) * pageSize;
      options.take = pageSize;
    }

    const results = await this.repo.find(options);
    return await this.repo
      .find(options)
      .then((bookings) =>
        bookings.map((booking) => BookingDTO.fromEntity(booking)),
      );
  }

  public async getTotalEarnings(start: Date, end: Date): Promise<number> {
    const query = this.repo
      .createQueryBuilder('booking')
      .select('SUM(booking.totalCost)');

    if (start && end) {
      query.where('booking.creationDate between :start and :end', {
        start: start,
        end: end,
      });
    }

    if (start) {
      query.where('booking.creationDate between :start and :end', {
        start: start,
        end: new Date(),
      });
    }

    return await query.getRawOne();
  }

  public async createBatch(batch: BookingBatchDTO): Promise<BookingDTO> {
    const startingAddress = AddressDTO.from(batch.startingAddress);
    const endingAddress = AddressDTO.from(batch.endingAddress);
    const booking = BookingDTO.from(batch.booking);

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      // Create addresses
      const startingPromise = queryRunner.manager.save(
        startingAddress.toEntity(),
      );
      const endingPromise = queryRunner.manager.save(endingAddress.toEntity());

      const [starting, ending] = await Promise.all([
        startingPromise,
        endingPromise,
      ]);

      booking.startingAddressId = starting.id;
      booking.endingAddressId = ending.id;

      // Create Booking
      const result = await queryRunner.manager.save(booking.toEntity());

      // Create new lift
      const newLift = new Lift();
      newLift.bookingId = result.id;
      newLift.completionToken = this.generateCompletionToken();

      await queryRunner.manager.save(newLift);

      // Handle refund if referral code exists
      if (batch.referralCode) {
        const referrerBooking = await this.repo.findOne({
          referralCode: batch.referralCode,
        });
        const session = await stripe.checkout.sessions.retrieve(
          referrerBooking.stripeSessionId,
        );
        const intentId = session.payment_intent;

        await stripe.refunds.create({
          payment_intent: intentId.toString(),
          amount: 1500,
        });

        await this.emailClient.sendBookingRefundSent(referrerBooking.email);
        referrerBooking.referralCode = 'complete';
        await this.repo.save(referrerBooking);
      }

      queryRunner.commitTransaction();

      return BookingDTO.fromEntity(result);
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  private generateCompletionToken(): string {
    let token = [];
    while (token.length === 0 || token[0].length !== 6) {
      token = words(1);
    }

    return token[0];
  }
}
