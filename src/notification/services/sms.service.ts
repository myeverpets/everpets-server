import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { User } from '@prisma/client';
import { NotificationService } from '../interfaces/notification.interface';

@Injectable()
export class SmsService implements NotificationService {
  public constructor(private readonly twilioService: TwilioService) {}

  public async sendVerificationCode(code: string, user: User) {
    try {
      await this.twilioService.client.messages.create({
        body: `Hi ${user.firstName} ${user.lastName}. Your OTP code is: ${code}. Don't share it with anyone. Token will expire in 15 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phoneNumber,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
