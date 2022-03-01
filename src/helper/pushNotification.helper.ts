import { Global, Injectable, Module } from '@nestjs/common';
import axios from 'axios';
import { IsString } from 'class-validator';

Injectable();
export class PushNotificationHelper {
  public async sendPushNotificationToTopic(
    request: PushNotificationRequest,
  ): Promise<void> {
    try {
      await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        {
          to: request.topic,
          notification: {
            body: request.message,
            title: request.title,
          },
        },
        {
          headers: {
            Authorization: `key=${process.env.FCM_SERVER_KEY}`,
          },
        },
      );
    } catch (err) {
      console.log(err);
    }
  }

  public async sendPaymentReminder() {
    await this.sendPushNotificationToTopic(
      new PushNotificationRequest({
        topic: `/topics/${process.env.NODE_ENV}-all`,
        title: 'Automatic Payout Reminder',
        message:
          'You will be automatically paid out your balance tomorrow by end of day. It may take a few days to enter your account',
      }),
    );
  }

  public async sendAcceptedLiftDeletedNotification(request: {
    acceptedLiftId: string;
    date: string;
    time: string;
  }) {
    await this.sendPushNotificationToTopic(
      new PushNotificationRequest({
        topic: `/topics/${process.env.NODE_ENV}-${request.acceptedLiftId}`,
        title: 'Lift Cancelled',
        message: `We are so sorry but your lift on ${request.date} at ${request.time} has been cancelled. Please contact lifter support if you have any questions`,
      }),
    );
  }
}

export class PushNotificationRequest
  implements Readonly<PushNotificationRequest>
{
  @IsString()
  topic: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  constructor(init?: Partial<PushNotificationRequest>) {
    Object.assign(this, init);
  }
}

@Global()
@Module({
  providers: [PushNotificationHelper],
  exports: [PushNotificationHelper],
})
export class PushNotificationModule {}
