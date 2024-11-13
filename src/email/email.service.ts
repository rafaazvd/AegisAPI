// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import {
  EmailPortInterface,
  IEmailBody,
} from '../ports/email/email-provider.interface';
import { SendGridAdapter } from './adapters/SendGrid/sendgrid.adapter';
import { MailgunAdapter } from './adapters/MailGun/mailgun.adapter';

@Injectable()
export class EmailService {
  private providers: EmailPortInterface[];

  constructor(
    private sendGridAdapter: SendGridAdapter,
    private mailgunAdapter: MailgunAdapter,
  ) {
    this.providers = [this.sendGridAdapter, this.mailgunAdapter];
  }

  async sendEmail({ to, from, text, subject, html }: IEmailBody) {
    for (const provider of this.providers) {
      try {
        const result = await provider.sendEmail({
          from,
          to,
          subject,
          text,
          html,
        });
        return result;
      } catch (error: any) {
        console.error(
          `Erro no provedor ${provider.constructor.name}: ${error.message}`,
        );
      }
    }
    throw new Error('Todos os provedores de e-mail falharam');
  }
}
