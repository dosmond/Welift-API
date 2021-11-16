import { Injectable } from '@nestjs/common';
import { SNS, Credentials, config } from 'aws-sdk';
import { BookingConfirmTextDTO } from 'src/dto/bookingConfirmText.dto';

// This should only be necessary for local dev work.
if (process.env.NODE_ENV == 'local') {
  const creds = new Credentials(
    process.env.AWS_CRED_KEY,
    process.env.AWS_CRED_SECRET,
  );
  config.credentials = creds;
  config.update({ region: 'us-east-1' });
}

@Injectable()
export class TextClient {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public async sendBookingConfirmedText(request: BookingConfirmTextDTO) {
    const { number, date, numLifters } = request;

    const subscriptions = [];
    const params = {
      Protocol: 'sms',
      TopicArn: 'arn:aws:sns:us-east-1:592473490836:booking-confirmation',
      Endpoint: `+1${number}`,
      ReturnSubscriptionArn: true,
    };

    console.info('Adding Subscription');
    const subscribePromise = new SNS({ apiVersion: '2010-03-31' })
      .subscribe(params)
      .promise();
    const result = await subscribePromise;
    subscriptions.push(result.SubscriptionArn);

    const message = `
Thanks for booking with Welift!
Your lift is scheduled for ${date} with ${numLifters} lifter(s).
Please contact us at support@thewelift.com with any questions.`;

    console.info('Sending Message');
    const publishParams = {
      Message: message,
      TopicArn: 'arn:aws:sns:us-east-1:592473490836:booking-confirmation',
    };

    const publishTextPromise = new SNS({ apiVersion: '2010-03-31' })
      .publish(publishParams)
      .promise();

    await publishTextPromise;
    await this.cleanUpSubscriptions(subscriptions);
  }

  sendCustomerCompletionCodeText = async ({ number, customer_name }, code) => {
    try {
      const subscriptions = [];
      const params = {
        Protocol: 'sms',
        TopicArn: 'arn:aws:sns:us-east-1:592473490836:Lift-Completion-Code',
        Endpoint: `+1${number}`,
        ReturnSubscriptionArn: true,
      };

      console.info('Adding Subscription');
      const subscribePromise = new SNS({ apiVersion: '2010-03-31' })
        .subscribe(params)
        .promise();
      const result = await subscribePromise;
      subscriptions.push(result.SubscriptionArn);

      const message = `Hello ${customer_name},
Your lifters are requesting completion on your lift.
Please provide them this code to end the lift.

${code.toUpperCase()}

If you have any issues, please reach out to 385-309-3256`;

      console.info('Sending Message');
      const publicParams = {
        Message: message /* required */,
        TopicArn: 'arn:aws:sns:us-east-1:592473490836:Lift-Completion-Code',
      };

      const publishTextPromise = new SNS({ apiVersion: '2010-03-31' })
        .publish(publicParams)
        .promise();

      await publishTextPromise;
      await this.cleanUpSubscriptions(subscriptions);

      return { result: { rows: ['Success'] } };
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  };

  private async cleanUpSubscriptions(subscriptions): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const promises: Promise<{ $response: AWS.Response<{}, AWS.AWSError> }>[] =
      [];

    for (const sub of subscriptions) {
      const params = {
        SubscriptionArn: sub /* required */,
      };

      promises.push(
        new SNS({ apiVersion: '2010-03-31' }).unsubscribe(params).promise(),
      );
    }

    await Promise.all(promises);
  }
}
