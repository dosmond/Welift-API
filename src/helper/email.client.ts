import { Transporter, createTransport } from 'nodemailer';
import { renderFile } from 'ejs';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

@Injectable()
export class EmailClient {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = this.init();
  }

  private init(): Transporter {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.LIFTER_APPLICANT_SENDING_EMAIL,
        pass: process.env.LIFTER_APPLICATION_EMAIL_PASSWORD,
      },
    });

    transporter.verify(function (error: Error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    return transporter;
  }

  public async sendApplicationSubmitEmail(
    email: string,
    lifterEncryptedData: string,
  ) {
    try {
      const lifterLink =
        process.env.FRONTEND +
        '/lifter-created' +
        `?var=${lifterEncryptedData}`;
      const data = await renderFile('./dist/assets/newLifterEmail.ejs', {
        lifterLink: lifterLink,
      });

      const signupCompleteMail = {
        from: process.env.LIFTER_APPLICANT_SENDING_EMAIL,
        to: email,
        subject: 'Thank you for joining Welift as a Lifter!',
        html: data,
        attachments: [
          {
            filename: 'logo.png',
            path: 'logo.png',
            cid: 'welift-logo',
          },
          {
            filename: 'welift-youtube-video.png',
            path: 'welift-youtube-video.png',
            cid: 'welift-youtube-video',
          },
        ],
      };

      return await this.sendMail(signupCompleteMail);
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  }

  sendLeadConvertEmail = async (
    email: string,
    bookingEncryptedData: string,
  ) => {
    try {
      const bookingLink =
        process.env.FRONTEND +
        '/confirm-booking' +
        `?var=${bookingEncryptedData}`;
      const data = await renderFile('./dist/assets/leadConversionEmail.ejs', {
        bookingLink: bookingLink,
      });
      const emailObject = {
        from: process.env.LIFTER_APPLICANT_SENDING_EMAIL,
        to: email,
        subject: 'Confirm your booking with Welift',
        html: data,
        attachments: [
          {
            filename: 'logo.png',
            path: './dist/assets/logo.png',
            cid: 'welift-logo',
          },
        ],
      };

      return await this.sendMail(emailObject);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  sendApplicationNotInNetwork = async (email) => {
    try {
      const data = await renderFile('./dist/assets/lifterNotInNetwork.ejs');
      const emailObject = {
        from: process.env.LIFTER_APPLICANT_SENDING_EMAIL,
        to: email,
        subject: 'Not in network!',
        html: data,
        attachments: [
          {
            filename: 'logo.png',
            path: 'logo.png',
            cid: 'welift-logo',
          },
          {
            filename: 'welift-youtube-video.png',
            path: 'welift-youtube-video.png',
            cid: 'welift-youtube-video',
          },
        ],
      };

      return await this.sendMail(emailObject);
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  };

  sendBookingReferralCode = async (email: string, code: string) => {
    try {
      const data = await renderFile('./dist/assets/bookingReferralCode.ejs', {
        referralCode: code,
      });
      const emailObject = {
        from: process.env.LIFTER_APPLICANT_SENDING_EMAIL,
        to: email,
        subject: "Here's your referral code!",
        html: data,
        attachments: [
          {
            filename: 'logo.png',
            path: './dist/assets/logo.png',
            cid: 'welift-logo',
          },
        ],
      };

      return await this.sendMail(emailObject);
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  };

  sendBookingRefundSent = async (email) => {
    try {
      const data = await renderFile('./assets/bookingRefundSent.ejs');
      const emailObject = {
        from: process.env.LIFTER_APPLICANT_SENDING_EMAIL,
        to: email,
        subject: 'Someone used your referral code!',
        html: data,
        attachments: [
          {
            filename: 'logo.png',
            path: 'logo.png',
            cid: 'welift-logo',
          },
        ],
      };

      return await this.sendMail(emailObject);
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  };

  sendCouponEmail = async ({
    customer_name,
    business_name,
    hours,
    custom_note,
    email,
  }) => {
    try {
      const couponCode = await this.getCouponCode(hours);

      const message = `Hi ${customer_name},<br><br> 

    <div>We are so excited to be helping you with your next move.<br>Our main goal at Welift is to change the moving experience. We know that this is a stressful time for you, so take some stress off your shoulders and leave the heavy lifting to us.<br>
<b>${business_name}</b> has gifted you ${hours} free hour(s) of moving labor with Welift. Visit our website at www.getwelift.com and use this code to redeem your free moving help! <br><br> <b>${couponCode}</b> <br><br>  If you have any questions, please contact us directly at (385)309-3256.</div>

<div>Luke Nafrada<br>
CEO/Co-Founder</div>

<p>${custom_note}</p>

<p>Welift | ${business_name}</p>`;

      const emailObject = {
        from: process.env.LIFTER_APPLICANT_SENDING_EMAIL,
        to: email,
        subject: 'Welift coupon',
        html: message,
      };

      return await this.sendMail(emailObject);
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  };

  sendWholeSaleCouponEmail = async ({
    business_name,
    hours,
    custom_note,
    email,
  }) => {
    try {
      const couponCode = await this.getCouponCode(hours);
      const data = await renderFile('./assets/wholesaleCoupon.ejs', {
        company_name: business_name,
        customMessage: custom_note,
        coupon: couponCode,
        hours: hours,
      });

      const emailObject = {
        from: process.env.LIFTER_APPLICANT_SENDING_EMAIL,
        to: email,
        subject: 'Welift coupon',
        html: data,
        attachments: [
          {
            filename: 'logo.png',
            path: 'logo.png',
            cid: 'welift-logo',
          },
        ],
      };

      return await this.sendMail(emailObject);
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  };

  private async sendMail(email): Promise<void> {
    try {
      await this.transporter.sendMail(email);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private async getCouponCode(hours: number): Promise<string> {
    const promotionCode = {
      coupon: this.getCouponId(hours),
      max_redemptions: 1,
    };

    const result = await stripe.promotionCodes.create(promotionCode);
    return result.code;
  }

  private getCouponId(hours: number): string {
    switch (hours) {
      case 1:
        return 'JBbBOugC';
      case 2:
        return 'KEjZkyOW';
      case 3:
        return 'xlY7K699';
      case 4:
        return 'waty2Afz';
      case 5:
        return 'JyyTd3lx';
      case 6:
        return 'H5rfVFao';
      case 7:
        return 'hbrUPdYw';
      case 8:
        return 'T3kabVcS';
      case 9:
        return 'mcYsoEvE';
      case 10:
        return 'WXZJo8FF';
      default:
        return '';
    }
  }
}