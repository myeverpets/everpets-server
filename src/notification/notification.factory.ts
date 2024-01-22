import { Injectable } from '@nestjs/common';
import { MailerService } from './services/mailer.service';
import { SmsService } from './services/sms.service';
import { NotificationService } from './interfaces/notification.interface';

export type NotificationType = 'sms' | 'email';

@Injectable()
export class NotificationFactory {
  constructor(
    private readonly mailerService: MailerService,
    private readonly smsService: SmsService,
  ) {}
  create(type: NotificationType): NotificationService {
    switch (type) {
      case 'sms':
        return this.smsService;
      case 'email':
        return this.mailerService;
      default:
        throw new Error('Invalid notification type');
    }
  }
}
