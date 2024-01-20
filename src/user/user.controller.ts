import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SendVerificationMailDto } from './dtos/send-verification-mail.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('verify-email')
  public async verifyEmail(@Body() body: { token: string }) {
    return await this.userService.verifyEmail(body.token);
  }
}
