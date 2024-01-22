import { User } from '@prisma/client';

export interface NotificationService {
  sendVerificationCode(code: string, user: User): Promise<boolean>;
}
