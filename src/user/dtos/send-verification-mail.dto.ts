import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationMailDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
