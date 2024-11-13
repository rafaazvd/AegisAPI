// import * as mailgun from 'mailgun-js';
const mailgun: any = () => {}; // fix import

import {
  EmailPortInterface,
  IResponse,
  IEmailBody,
} from '../../../ports/email/email-provider.interface';

export class MailgunAdapter implements EmailPortInterface {
  private mg;

  constructor() {
    this.mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
  }

  async sendEmail({
    to,
    from,
    text,
    subject,
    html,
  }: IEmailBody): Promise<IResponse> {
    const data = {
      from,
      to,
      subject,
      text,
      html,
    };
    try {
      const result = await this.mg.messages().send(data);
      return {
        success: true,
        message: 'Email send by mailgun',
        data: result,
      };
    } catch (error) {
      console.log({ error });
      throw new Error('Mailgun email failed');
    }
  }
}
