import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SendVerificationMailDto } from './dtos/send-verification-mail.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { SendVerificationSmsDto } from './dtos/send-verification-sms.dto';
import { VerificationDto } from './dtos/verification.dto';

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
}
