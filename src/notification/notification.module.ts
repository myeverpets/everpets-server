import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { MailerService } from './services/mailer.service';
import { SmsService } from './services/sms.service';
import { NotificationFactory } from './notification.factory';

@Module({
  providers: [NotificationFactory, MailerService, SmsService],
  exports: [MailerService, SmsService, NotificationFactory],
  imports: [
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
})
export class NotificationModule {}
