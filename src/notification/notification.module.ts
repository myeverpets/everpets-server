import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
})
export class NotificationModule {}
