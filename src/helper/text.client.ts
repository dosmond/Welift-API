import { BookingDTO } from './../dto/booking.dto';
import { CustomerPrepEvent } from './../events/customerPrep.event';
import { EventNames } from './../enum/eventNames.enum';
import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { SNS, Credentials, config } from 'aws-sdk';
import { BookingConfirmTextDTO } from '@src/dto/bookingConfirmText.dto';
import { OnEvent } from '@nestjs/event-emitter';

// This should only be necessary for local dev work.
if (process.env.NODE_ENV == 'local') {
  const creds = new Credentials(
    process.env.AWS_CRED_KEY,
    process.env.AWS_CRED_SECRET,
  );
  config.credentials = creds;
}

config.update({ region: 'us-east-1' });

@Injectable()
export class TextClient {
  private readonly logger = new Logger(TextClient.name);

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

  sendPhoneVerificationText = async ({ phoneNumber, code }) => {
    try {
      const params: SNS.PublishInput = {
        Message: `Your Welift confirmation code is: 
    
  ${code}`,
        PhoneNumber: phoneNumber,
      };

      await new SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  public async sendCustomerBookingCancellationText(request: {
    name: string;
    phoneNumber: string;
  }) {
    try {
      const message = `Hi ${request.name}, We appreciate you requesting a lift with us. We are so sorry to inform you that we are unable to fulfill your request on your selected date and time. If you would like to select another date or time please contact customer success via text or phone call at (385) 309-3256 or visit https://getwelift.com/request-a-lift. Thank you.`;

      const params: SNS.PublishInput = {
        Message: message,
        PhoneNumber: `+1${BookingDTO.standardizePhoneNumber(
          request.phoneNumber,
        )}`,
      };

      await new SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    } catch (err) {
      this.logger.error(err);
    }
  }

  public async sendLifterClockInReminderText(request: {
    phoneNumber: string;
    city: string;
  }) {
    try {
      const message = `Your lift in ${request.city} is about to start! Don't forget to clock in!`;

      const params: SNS.PublishInput = {
        Message: message,
        PhoneNumber: `+1${BookingDTO.standardizePhoneNumber(
          request.phoneNumber,
        )}`,
      };

      await new SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    } catch (err) {
      this.logger.error(err);
    }
  }

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

  @OnEvent(EventNames.CustomerPrep)
  private async handleSentCustomerPrepText(payload: CustomerPrepEvent) {
    try {
      const message = `Hi ${payload.name}, We are so excited to be helping with your lift, tomorrow ${payload.date} at ${payload.time}.
Before our lifters arrive, please complete the following steps: 

  1) Make sure boxes and items are packed and ready to be loaded.
  2) Disassemble all items if necessary/ disconnect appliances/electronics  (our lifters can help, but are not trained in assembly) 
  3) Take out items/clothes from dressers.
  4) Make sure to have your truck picked up and have someone to drive the truck before your lifter's arrive time.
  5) Verify that the move has been confirmed (via confirmation email) and confirm details. 

If you cannot complete these items, before your lifters arrive or you have any other questions,  please contact (385) 309-3256 to cancel or reschedule your lift. Unfortunately, if the lifters arrive and these items are not complete, the lift may not be completed in the time you have booked. Thanks!`;

      const params: SNS.PublishInput = {
        Message: message,
        PhoneNumber: `+1${BookingDTO.standardizePhoneNumber(
          payload.phoneNumber,
        )}`,
      };

      await new SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    } catch (err) {
      this.logger.error(err);
    }
  }
}

@Global()
@Module({
  providers: [TextClient],
  exports: [TextClient],
})
export class TextModule {}
