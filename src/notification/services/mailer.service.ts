import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { User } from '@prisma/client';
import { NotificationService } from '../interfaces/notification.interface';

@Injectable()
export class MailerService implements NotificationService {
  private readonly mailerClient: SES;
  constructor() {
    this.mailerClient = new SES({
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      region: process.env.AWS_SES_REGION,
    });
  }

  public async sendVerificationCode(
    code: string,
    user: User,
  ): Promise<boolean> {
    try {
      const params = {
        Source: process.env.AWS_SES_EMAIL_SOURCE,
        Destination: {
          ToAddresses: [user.email],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<html>
              <body>
                <h1>Verification Code</h1>
                <p>Hi ${user.firstName} ${user.lastName},</p>
                <p>Here is your verification code: ${code}</p>
                <p>Don't share it with anyone. Token will expire in 15 minutes.<p>
              </body>
            </html>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Verification Code',
          },
        },
      };
      await this.mailerClient.sendEmail(params).promise();
      return true;
    } catch (err) {
      return false;
    }
  }
}
