import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { User } from '@prisma/client';

@Injectable()
export class SnsService {
  private readonly snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_SNS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY,
      },
    });
  }

  public async sendSms(code: string, user: User) {
    try {
      const params = {
        Message: `Hi ${user.firstName} ${user.lastName} Your OTP code is: ${code}. Don't share it with anyone. Token will expire in 15 minutes.`,
        PhoneNumber: user.phoneNumber,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: 'Everpets',
          },
        },
      };
      const command = new PublishCommand(params);
      const m = await this.snsClient.send(command);
      console.log(m.$metadata);
      console.log(1);
      return true;
    } catch (error) {
      return false;
    }
  }
}
