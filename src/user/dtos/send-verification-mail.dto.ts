import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationMailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
