// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendGridAdapter } from './adapters/SendGrid/sendgrid.adapter';
import { MailgunAdapter } from './adapters/MailGun/mailgun.adapter';

@Module({
  providers: [EmailService, SendGridAdapter, MailgunAdapter],
  exports: [EmailService],
})
export class EmailModule {}
