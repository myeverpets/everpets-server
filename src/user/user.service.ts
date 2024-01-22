import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import * as crypto from 'crypto';
import { SendVerificationMailDto } from './dtos/send-verification-mail.dto';
import { NotificationFactory } from 'src/notification/notification.factory';
import { UserAvatarService } from 'src/s3-uploader/services/user-avatar.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationServiceFactory: NotificationFactory,
    private readonly userAvatarService: UserAvatarService,
  ) {}
  public async createUser(userDto: CreateUserDto): Promise<User | null> {
    const exitstingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: userDto.email }, { phoneNumber: userDto.phoneNumber }],
      },
    });
    if (exitstingUser) {
      return null;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const user = await this.prismaService.user.create({
      data: {
        ...userDto,
        password: hashedPassword,
      },
    });

    return user;
  }

  public async getUserByEmailOrPhoneNumber(
    phoneNumber?: string,
    email?: string,
  ): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });
  }

  public async getUserByPhoneNumberAndEmail(
    phoneNumber: string,
    email: string,
  ): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: {
        AND: [{ phoneNumber }, { email }],
      },
    });
  }

  public async getById(userId: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });
  }

  public async sendVerificationMail(dto: SendVerificationMailDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.isEmailVerified) {
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
    }
    const verificationCode = await this.generateSecureCode();
    const expirationTime = new Date(Date.now() + 1000 * 60 * 15);
    await this.prismaService.emailVerification.upsert({
      where: {
        userId: user.userId,
      },
      update: {
        code: verificationCode,
        expiresAt: expirationTime,
      },
      create: {
        userId: user.userId,
        code: verificationCode,
        expiresAt: expirationTime,
      },
    });
    const isSent = await this.notificationServiceFactory
      .create('email')
      .sendVerificationCode(verificationCode, user);
    if (!isSent) {
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'Email sent successfully' };
  }

  public async verifyEmail(token: string) {
    const emailVerification =
      await this.prismaService.emailVerification.findFirst({
        where: {
          code: token,
        },
      });
    if (!emailVerification) {
      throw new HttpException(
        'Invalid token or user already verified',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        userId: emailVerification.userId,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (emailVerification.expiresAt < new Date()) {
      await this.prismaService.emailVerification.delete({
        where: { emailCodeId: emailVerification.emailCodeId },
      });
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }
    await this.prismaService.user.update({
      where: {
        userId: user.userId,
      },
      data: {
        isEmailVerified: true,
      },
    });
    await this.prismaService.emailVerification.delete({
      where: {
        emailCodeId: emailVerification.emailCodeId,
      },
    });
    return { message: 'Email verified successfully' };
  }

  public async sendVerificationSms(phoneNumber: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        phoneNumber,
      },
    });
    console.log(user);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.isPhoneVerified) {
      throw new HttpException(
        'Phone number already verified',
        HttpStatus.BAD_REQUEST,
      );
    }
    const verificationCode = await this.generateSecureCode();
    const expirationTime = new Date(Date.now() + 1000 * 60 * 15);
    await this.prismaService.phoneVerification.upsert({
      where: {
        userId: user.userId,
      },
      update: {
        code: verificationCode,
        expiresAt: expirationTime,
      },
      create: {
        userId: user.userId,
        code: verificationCode,
        expiresAt: expirationTime,
      },
    });
    const isSent = await this.notificationServiceFactory
      .create('sms')
      .sendVerificationCode(verificationCode, user);
    if (!isSent) {
      throw new HttpException(
        'Failed to send sms',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'Sms sent successfully' };
  }

  public async verifySms(token: string) {
    const phoneVerification =
      await this.prismaService.phoneVerification.findFirst({
        where: {
          code: token,
        },
      });
    if (!phoneVerification) {
      throw new HttpException(
        'Invalid token or user already verified',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        userId: phoneVerification.userId,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (phoneVerification.expiresAt < new Date()) {
      await this.prismaService.phoneVerification.delete({
        where: { phoneCodeId: phoneVerification.phoneCodeId },
      });
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }
    await this.prismaService.user.update({
      where: {
        userId: user.userId,
      },
      data: {
        isPhoneVerified: true,
      },
    });
    await this.prismaService.phoneVerification.delete({
      where: {
        phoneCodeId: phoneVerification.phoneCodeId,
      },
    });
    return { message: 'Phone number verified successfully' };
  }
  public async generateSecureCode() {
    const secureRandomBytes = crypto.randomBytes(4);
    const hexCode = secureRandomBytes.toString('hex');
    const eightDigitCode = hexCode.slice(0, 8);
    return eightDigitCode;
  }

  public async uploadAvatar(userId: number, file: Buffer) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const res = await this.userAvatarService.uploadAvatar(file);
    if (!res) {
      throw new HttpException(
        'Failed to upload avatar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.prismaService.userPhoto.upsert({
      where: {
        userId: user.userId,
      },
      update: {
        photoUrl: res.url,
        key: res.key,
      },
      create: {
        userId: user.userId,
        photoUrl: res.url,
        key: res.key,
      },
    });

    return { message: 'Avatar uploaded successfully' };
  }

  public async getAvatar(userId: number) {
    const userPhoto = await this.prismaService.userPhoto.findFirst({
      where: {
        userId,
      },
    });

    if (!userPhoto) {
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }

    return { url: userPhoto.photoUrl };
  }

  public async deleteAvatar(userId: number) {
    const userPhoto = await this.prismaService.userPhoto.findFirst({
      where: {
        userId,
      },
    });

    if (!userPhoto) {
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }

    await this.userAvatarService.deleteAvatar(userPhoto.key);

    await this.prismaService.userPhoto.delete({
      where: {
        photoId: userPhoto.photoId,
      },
    });

    return { message: 'Avatar deleted successfully' };
  }
}
