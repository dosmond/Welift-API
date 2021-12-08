import { Note } from 'src/model/note.entity';
import { CheckoutSessionDTO } from './../../dto/checkoutSession.dto';
import { AcceptedLift } from 'src/model/acceptedLift.entity';
import { PartnerReferral } from './../../model/partnerReferrals.entity';
import { Partners } from './../../model/Partners.entity';
import { GoogleCalendarApiHelper } from './../../helper/googleCalendar.helper';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { EmailClient } from '../../helper/email.client';
import { Booking } from './../../model/booking.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getConnection,
  Repository,
  Between,
  FindManyOptions,
  DeleteResult,
} from 'typeorm';
import { BookingDTO } from 'src/dto/booking.dto';
import { BookingBatchDTO } from 'src/dto/booking.batch.dto';
import { AddressDTO } from 'src/dto/address.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const words = require('random-words');

import Stripe from 'stripe';
import { Lift } from 'src/model/lifts.entity';
import { BookingUpdateDTO } from 'src/dto/booking.update.dto';
import { Address } from 'src/model/addresses.entity';
const stripe = new Stripe(process.env.GATSBY_STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
    @InjectRepository(Partners)
    private readonly partnerRepo: Repository<Partners>,
    @InjectRepository(PartnerReferral)
    private readonly partnerReferralRepo: Repository<PartnerReferral>,
    @InjectRepository(Lift)
    private readonly liftRepo: Repository<Lift>,
    @InjectRepository(AcceptedLift)
    private readonly acceptedLiftRepo: Repository<AcceptedLift>,
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    private emailClient: EmailClient,
    private googleHelper: GoogleCalendarApiHelper,
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

  public async count(): Promise<number> {
    return await this.repo.count();
  }

  public async createBatch(batch: BookingBatchDTO): Promise<BookingDTO> {
    const startingAddress = AddressDTO.from(batch.startingAddress);
    const booking = BookingDTO.from(batch.booking);

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      // Create addresses
      const promises: Promise<Address>[] = [];
      promises.push(queryRunner.manager.save(startingAddress.toEntity()));

      if (batch.endingAddress) {
        const endingAddress = AddressDTO.from(batch.endingAddress);
        promises.push(queryRunner.manager.save(endingAddress.toEntity()));
      }

      const [starting, ending] = await Promise.all(promises);

      booking.startingAddressId = starting.id;
      booking.endingAddressId = ending?.id;

      // Create google calendar event
      if (process.env.NODE_ENV === 'production') {
        const { data } = await this.handleCreateGoogleCalendar(
          starting,
          booking.toEntity(),
        );

        booking.calendarEventId = data.id;
      }

      // Create Booking
      const result = await queryRunner.manager.save(booking.toEntity());

      // Create new lift
      const newLift = new Lift();
      newLift.bookingId = result.id;
      newLift.completionToken = this.generateCompletionToken();

      await queryRunner.manager.save(newLift);

      // Handle refund if referral code exists
      if (batch.referralCode) {
        if (batch.referralCode.length === 8) {
          await this.handleBookingReferral(batch);
        }
        if (batch.referralCode.length === 10) {
          await this.handlePartnerReferral(batch, result.id);
        }
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return BookingDTO.fromEntity(result);
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err;
    }
  }

  public async sendReferralCode(bookingId: string): Promise<void> {
    const booking = await this.repo.findOne({ id: bookingId });
    await this.emailClient.sendBookingReferralCode(
      booking.email,
      booking.referralCode,
    );
  }

  public async checkPromoCode(
    code: string,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.PromotionCode>>> {
    const result = await stripe.promotionCodes.list({
      code: code,
    });

    if (result.data.length === 0)
      throw new BadRequestException('Promo code does not exist');

    return result;
  }

  public async createCheckoutSession(
    request: CheckoutSessionDTO,
  ): Promise<{ id: string }> {
    const { customerName, total, cancelUrl, ...rest } = request;

    let url = cancelUrl;
    if (!cancelUrl) url = 'book-a-lift';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Welift Booking for ${customerName}`,
            },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.LANDING_FRONTEND}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.LANDING_FRONTEND}/${url}`,
      //allow_promotion_codes: true,
      metadata: {
        ...rest,
      },
    });

    return { id: session.id };
  }

  public async update(request: BookingUpdateDTO): Promise<BookingDTO> {
    const dto = BookingUpdateDTO.from(request);
    const result = BookingDTO.fromEntity(await this.repo.save(dto.toEntity()));

    if (process.env.NODE_ENV === 'production') {
      await this.handleUpdateGoogleCalendar(result);
    }

    return result;
  }

  public async delete(
    id: string,
    state: string,
    eventId: string,
  ): Promise<DeleteResult> {
    const booking = await this.repo.findOne(
      { id: id },
      { relations: ['lift', 'lift.acceptedLifts', 'notes'] },
    );

    // Step 1: Delete Accepted Lifts
    if (booking.lift?.acceptedLifts.length > 0) {
      const deletePromises: Promise<DeleteResult>[] = [];
      booking.lift?.acceptedLifts?.forEach((acceptedLift) => {
        deletePromises.push(this.acceptedLiftRepo.delete(acceptedLift));
      });

      await Promise.all(deletePromises);
    }

    // Step 2: Delete Lift
    await this.liftRepo.delete({ id: booking.lift?.id });

    // Step 3: Delete Notes
    if (booking.notes.length > 0) {
      const deletePromises: Promise<DeleteResult>[] = [];
      booking.notes.forEach((item) => {
        deletePromises.push(this.noteRepo.delete({ id: item.id }));
      });

      await Promise.all(deletePromises);
    }

    // Step 4: Delete Booking
    const result = this.repo.delete({ id: booking.id });

    if (process.env.NODE_ENV === 'production' && state && eventId) {
      await this.googleHelper.deleteGoogleCalendarEvent({
        state: state,
        eventId: eventId,
      });
    }

    return result;
  }

  private generateCompletionToken(): string {
    let token = [];
    while (token.length === 0 || token[0].length !== 6) {
      token = words(1);
    }

    return token[0];
  }

  private async handleBookingReferral(batch: BookingBatchDTO): Promise<void> {
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

  private async handlePartnerReferral(
    batch: BookingBatchDTO,
    bookingId: string,
  ): Promise<void> {
    const referrerPartner = await this.partnerRepo.findOne({
      referralCode: batch.referralCode,
    });

    const referral = new PartnerReferral();
    referral.partnerId = referrerPartner.id;
    referral.bookingId = bookingId;
    await this.partnerReferralRepo.save(referral);
  }

  private async handleCreateGoogleCalendar(
    starting: Address,
    booking: Booking,
  ) {
    const formattedAddress = `${starting.street} ${starting.street2}\n${starting.city} ${starting.state}, ${starting.postalCode}`;
    return await this.googleHelper.createGoogleCalendarEvent({
      state: starting.state,
      description: `${formattedAddress}\n\n${booking.additionalInfo}\n${booking.specialItems}`,
      title: booking.name,
      start: new Date(booking.startTime).toISOString(),
      end: new Date(booking.endTime).toISOString(),
    });
  }

  private async handleUpdateGoogleCalendar(result: BookingDTO) {
    try {
      const resolvedBooking = await this.repo.findOne(
        { id: result.id },
        { relations: ['startingAddress'] },
      );
      const addressInfo = resolvedBooking.startingAddress;
      const formattedAddress = `${addressInfo.street} ${addressInfo.street2}\n${addressInfo.city} ${addressInfo.state}, ${addressInfo.postalCode}`;
      await this.googleHelper.updateGoogleCalendarEvent({
        state: addressInfo.state,
        description: `${formattedAddress}\n\n${resolvedBooking.additionalInfo}\n${resolvedBooking.specialItems}`,
        title: resolvedBooking.name,
        start: new Date(resolvedBooking.startTime).toISOString(),
        end: new Date(resolvedBooking.endTime).toISOString(),
        eventId: resolvedBooking.calendarEventId,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
