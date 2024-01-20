import {
  Body,
  Controller,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { Express } from 'express';
import { UserService } from './user.service';
import { SendVerificationMailDto } from './dtos/send-verification-mail.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { SendVerificationSmsDto } from './dtos/send-verification-sms.dto';
import { VerificationDto } from './dtos/verification.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('access'))
  @Post('send-verification-mail')
  public async sendVerificationMail(
    @Body() sendVerificationMailDto: SendVerificationMailDto,
  ) {
    return await this.userService.sendVerificationMail(sendVerificationMailDto);
  }

  @UseGuards(AuthGuard('access'))
  @Post('verify-email')
  public async verifyEmail(@Body() tokenDto: VerificationDto) {
    return await this.userService.verifyEmail(tokenDto.token);
  }

  @UseGuards(AuthGuard('access'))
  @Post('send-verification-sms')
  public async sendVerificationSms(
    @Body() sendVerificationSmsDto: SendVerificationSmsDto,
  ) {
    return await this.userService.sendVerificationSms(
      sendVerificationSmsDto.phoneNumber,
    );
  }

  @UseGuards(AuthGuard('access'))
  @Post('verify-sms')
  public async verifySms(@Body() tokenDto: VerificationDto) {
    return await this.userService.verifySms(tokenDto.token);
  }

  @UseGuards(AuthGuard('access'))
  @UseInterceptors(FileInterceptor('image'))
  @Post('photo/:userId')
  public async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: number,
  ) {
    return await this.userService.uploadAvatar(userId, file.buffer);
  }

  @UseGuards(AuthGuard('access'))
  @Get('photo/:userId')
  public async getAvatar(@Param('userId') userId: number) {
    return await this.userService.getAvatar(userId);
  }

  @UseGuards(AuthGuard('access'))
  @Delete('photo/:userId')
  public async deleteAvatar(@Param('userId') userId: number) {
    return await this.userService.deleteAvatar(userId);
  }
}
