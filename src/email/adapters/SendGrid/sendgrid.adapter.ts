import {
  EmailPortInterface,
  IResponse,
  IEmailBody,
} from '../../../ports/email/email-provider.interface';
import sgMail from '@sendgrid/mail';

export class SendGridAdapter implements EmailPortInterface {
  constructor() {}

  async sendEmail({
    to,
    from,
    text,
    subject,
    html,
  }: IEmailBody): Promise<IResponse> {
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const result = await sgMail.send(msg);
      return {
        success: true,
        message: 'Email send by mailgun',
        data: result,
      };
    } catch (error) {
      console.log({ error });
      return {
        success: false,
        message: 'SendGrid email failed',
        data: error,
      };
    }
  }
}
