import {
  PushNotificationHelper,
  PushNotificationRequest,
} from './../../helper/pushNotification.helper';
import { EventNames } from './../../enum/eventNames.enum';
import { BookingLocationCount } from '../../model/bookingLocationCount.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BookingLocationCountService {
  constructor(
    @InjectRepository(BookingLocationCount)
    private readonly repo: Repository<BookingLocationCount>,
    private readonly pushNotificationHelper: PushNotificationHelper,
  ) {}

  public async getByState(state: string): Promise<BookingLocationCount> {
    return await this.repo.findOne({ state: state });
  }

  public async getAll(): Promise<BookingLocationCount[]> {
    return await this.repo.find();
  }

  public async upsert(
    request: BookingLocationCount,
  ): Promise<BookingLocationCount> {
    return await this.repo.save(request);
  }

  @OnEvent(EventNames.CheckBookingCount)
  private async handleCheckBookingCountEvent() {
    const rows: BookingLocationCount[] = await this.getAll();
    const promises: Promise<void | BookingLocationCount>[] = [];

    rows.forEach((row) => {
      if (row.count > 0) {
        // Don't send push notifications to production if you aren't production!
        const topic = `/topics/${process.env.NODE_ENV}-${row.state}`;

        const request = new PushNotificationRequest({
          topic: topic,
          title: 'New Lifts Available!',
          message: `${row.count} lift request(s) available. Earn more from jobs today!`,
        });

        row.count = 0;

        promises.push(
          this.pushNotificationHelper.sendPushNotificationToTopic(request),
          this.upsert(row),
        );
      }
    });

    await Promise.all(promises);
  }
}
