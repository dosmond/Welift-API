import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';

// This should only be necessary for local dev work.
if (process.env.NODE_ENV == 'local') {
  let creds = new AWS.Credentials(process.env.AWS_CRED_KEY, process.env.AWS_CRED_SECRET)
  AWS.config.credentials = creds
  AWS.config.update({ region: 'us-east-1' })
}

@Injectable()
export class TextClient {
  constructor() { }

  public async sendBookingConfirmedText({ number, date, num_lifters }) {
    let subscriptions = []
    var params = {
      Protocol: "sms",
      TopicArn: "arn:aws:sns:us-east-1:592473490836:booking-confirmation",
      Endpoint: number,
      ReturnSubscriptionArn: true
    };

    console.info("Adding Subscription")
    var subscribePromise = new AWS.SNS({ apiVersion: '2010-03-31' }).subscribe(params).promise();
    let result = await subscribePromise
    subscriptions.push(result.SubscriptionArn)

    let message = `
Thanks for booking with Welift!
Your lift is scheduled for ${date} with ${num_lifters} lifters.
Please contact us at support@thewelift.com with any questions.`

    console.info("Sending Message")
    var publishParams = {
      Message: message,
      TopicArn: 'arn:aws:sns:us-east-1:592473490836:booking-confirmation'
    };

    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(publishParams).promise();

    await publishTextPromise
    await this.cleanUpSubscriptions(subscriptions)
  };

  sendCustomerCompletionCodeText = async ({ number, customer_name }, code) => {
    try {
      let subscriptions = []
      var params = {
        Protocol: "sms",
        TopicArn: "arn:aws:sns:us-east-1:592473490836:Lift-Completion-Code",
        Endpoint: `+1${number}`,
        ReturnSubscriptionArn: true
      };

      console.info("Adding Subscription")
      var subscribePromise = new AWS.SNS({ apiVersion: '2010-03-31' }).subscribe(params).promise();
      let result = await subscribePromise
      subscriptions.push(result.SubscriptionArn)

      let message = `Hello ${customer_name},
Your lifters are requesting completion on your lift.
Please provide them this code to end the lift.

${code.toUpperCase()}

If you have any issues, please reach out to 385-309-3256`

      console.info("Sending Message")
      var publicParams = {
        Message: message, /* required */
        TopicArn: 'arn:aws:sns:us-east-1:592473490836:Lift-Completion-Code'
      };

      var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(publicParams).promise();

      await publishTextPromise
      await this.cleanUpSubscriptions(subscriptions)

      return { result: { rows: ["Success"] } }
    }
    catch (err) {
      console.log(err)
      return { error: err }
    }

  };

  private async cleanUpSubscriptions(subscriptions): Promise<void> {
    let promises: Promise<{ $response: AWS.Response<{}, AWS.AWSError> }>[] = []

    for (let sub of subscriptions) {
      var params = {
        SubscriptionArn: sub /* required */
      };

      promises.push(new AWS.SNS({ apiVersion: '2010-03-31' }).unsubscribe(params).promise())
    }

    await Promise.all(promises)
  }

}