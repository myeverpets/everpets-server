import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, RefreshTokenPayload } from './interfaces';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  public async register(registerDto: RegisterDto): Promise<User | null> {
    return await this.userService.createUser(registerDto);
  }

  public async validateLogin(loginDto: LoginDto): Promise<User | null> {
    let user: User;
    if (!loginDto.phoneNumber && !loginDto.email) {
      return null;
    }
    if (
      (!loginDto.phoneNumber && loginDto.email) ||
      (loginDto.phoneNumber && !loginDto.email)
    ) {
      user = await this.userService.getUserByEmailOrPhoneNumber(
        loginDto.phoneNumber,
        loginDto.email,
      );
    } else {
      user = await this.userService.getUserByPhoneNumberAndEmail(
        loginDto.phoneNumber,
        loginDto.email,
      );
    }
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  public async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      photoUrl: null,
    };

    return await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }
  private async generateRefreshToken(user: User): Promise<string> {
    const payload: RefreshTokenPayload = {
      sub: user.userId,
    };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }
}
