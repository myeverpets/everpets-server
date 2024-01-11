import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
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

  public async getByUsernameOrEmail(
    phoneNumber?: string,
    email?: string,
  ): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });
  }

  public async getByUsernameAndEmail(
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
}
