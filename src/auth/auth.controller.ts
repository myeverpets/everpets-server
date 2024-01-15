import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateLogin(loginDto);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(registerDto);
    if (!user) {
      throw new HttpException(
        'User with this phone number or email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  }

  @Post('logout')
  public async logOut(@Res() res: Response) {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  public async refresh(@Req() req: Request, @Res() res: Response) {
    const user = req?.user as User;
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const { accessToken, refreshToken } =
      await this.authService.generateTokens(user);
    res.clearCookie('refreshToken');
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  }
}
