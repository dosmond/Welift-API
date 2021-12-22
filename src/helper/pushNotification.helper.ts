import { Injectable } from '@nestjs/common';
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

  constructor(request: { topic: string; title: string; message: string }) {
    this.topic = request.topic;
    this.title = request.title;
    this.message = request.message;
  }
}
