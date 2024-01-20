import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { User } from '@prisma/client';

@Injectable()
export class MailerService {
  private readonly mailerClient: SES;
  constructor() {
    this.mailerClient = new SES({
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      region: process.env.AWS_SES_REGION,
    });
  }
  public async sendEmail(verificationCode: string, user: User) {
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
                <p>Here is your verification code: ${verificationCode}</p>
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
