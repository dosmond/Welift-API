import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SlackHelper {
  private readonly LIFTER_CREATION = 'Lifter';
  private readonly LIFT_REQUEST = 'Lift Request';
  private readonly BOOKING_CREATION = 'Booking';
  static readonly HIGH_RISK_DELETION = 'High Risk Booking Deletion';
  static readonly HIGH_RISK_BOOKING = 'High Risk Booking';

  public prepareVitalErrorSlackMessage = (error, sm) => {
    const message: any = {
      text: `VITAL ERROR AT ${sm.location}.`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `VITAL ERROR AT ${sm.location} :exclamation:`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `The failure occured at ${new Date().toISOString()} and contained the following properties:`,
          },
        },
      ],
    };

    let sectionNum = 23423;
    sm.objects.forEach((item) => {
      message.blocks.push({
        type: 'section',
        block_id: `section${sectionNum}`,
        text: {
          type: 'mrkdwn',
          text: '```' + JSON.stringify(item) + '```',
        },
      });
      sectionNum++;
    });

    message.blocks.push({
      type: 'section',
      block_id: `section9999`,
      text: {
        type: 'mrkdwn',
        text: '*ERROR*\n```' + error.toString() + '```',
      },
    });

    return message;
  };

  public prepareDetailedSlackMessage = (sm, success, error = null) => {
    if (sm === null) return null;

    const message: any = {
      text: `${sm.type} creation called.`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${sm.type} creation called.`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*STATUS* ${
              success ? 'SUCCESS :white_check_mark:' : 'FAILURE :exclamation:'
            }`,
          },
        },
      ],
    };

    let sectionNum = 23423;
    sm.objects.forEach((item) => {
      message.blocks.push({
        type: 'section',
        block_id: `section${sectionNum}`,
        text: {
          type: 'mrkdwn',
          text: '```' + JSON.stringify(item) + '```',
        },
      });
      sectionNum++;
    });

    message.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `The failed call was sent at ${new Date().toISOString()} and contained the following properties:`,
      },
    });

    message.blocks.push({
      type: 'section',
      block_id: `section9999`,
      text: {
        type: 'mrkdwn',
        text: '*ERROR*\n```' + JSON.stringify(error) + '```',
      },
    });

    return message;
  };

  public prepareBasicSuccessSlackMessage = (sm: any) => {
    if (sm === null) return null;

    if (sm.sendBasic !== true) return null;

    let message: any = {
      text: `${sm.type} creation called.`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${sm.type} creation called.`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*STATUS* SUCCESS :white_check_mark:`,
          },
        },
      ],
    };

    message = this.generateMessageBlock(sm.type, sm.objects, message);

    message.blocks.push({
      type: 'divider',
    });

    return message;
  };

  public sendDetailedSlackMessage = async (message) => {
    if (message === null) return;

    try {
      await axios.post(process.env.SLACK_WEBHOOK, message);
    } catch (err) {}
  };

  public sendBasicSucessSlackMessage = async (message) => {
    if (message === null) return;

    try {
      await axios.post(process.env.SLACK_LANDING_WEBHOOK, message);
    } catch (err) {}
  };

  private generateMessageBlock = (
    type: string,
    objects: any[],
    message: any,
  ) => {
    switch (type) {
      case this.LIFTER_CREATION:
        return this.generateLifterMessageBlock(objects, message);
      case this.LIFT_REQUEST:
        return this.generateLiftRequestMessageBlock(objects, message);
      case this.BOOKING_CREATION:
        return this.generateBookingMessageBlock(objects, message);
      case SlackHelper.HIGH_RISK_DELETION:
        return this.generateHighRiskDeletionMessageblock(objects, message);
      case SlackHelper.HIGH_RISK_BOOKING:
        return this.generateBookingMessageBlock(objects, message);
      default:
        break;
    }
  };

  private generateHighRiskDeletionMessageblock = (
    objects: any[],
    message: any,
  ) => {
    const booking = objects[0];

    message.blocks.push({
      type: 'section',
      block_id: `section1234`,
      text: {
        type: 'mrkdwn',
        text: `*Name*: ${booking.name}\n*Phone*: ${booking.phone}\n*Email*: ${booking.email}`,
      },
    });

    return message;
  };

  private generateLifterMessageBlock = (objects: any[], message: any) => {
    const lifter = objects[1];

    message.blocks.push({
      type: 'section',
      block_id: `section1234`,
      text: {
        type: 'mrkdwn',
        text: `*Name*: ${lifter.first_name} ${lifter.last_name}`,
      },
    });

    return message;
  };

  private generateLiftRequestMessageBlock = (objects: any[], message: any) => {
    const request = objects[0];

    message.blocks.push({
      type: 'section',
      block_id: `section1234`,
      text: {
        type: 'mrkdwn',
        text: `*Name*: ${request.name}\n*Phone*: ${request.phone}\n*Email*: ${request.email}`,
      },
    });

    return message;
  };

  private generateBookingMessageBlock = (objects: any[], message: any) => {
    const request = objects[2];

    message.blocks.push({
      type: 'section',
      block_id: `section1234`,
      text: {
        type: 'mrkdwn',
        text: `*Name*: ${request.name}\n*Phone*: ${request.phone}\n*Email*: ${request.email}`,
      },
    });

    return message;
  };
}
