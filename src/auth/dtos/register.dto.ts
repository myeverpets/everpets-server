import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, NotContains, Length, IsAlpha } from 'class-validator';
import { IsAllowedPhoneNumber } from '../validators/isAllowedPhoneNumber.validation';
import { Transform } from 'class-transformer';
import { phoneNumberTransformer } from '../transformers/phone-number.transformer';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @Length(1, 64)
  @IsAlpha('en-US', { message: 'First name can only contain english letters' })
  readonly firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Length(1, 64)
  @IsAlpha('en-US', { message: 'Last name can only contain english  letters' })
  readonly lastName: string;

  @ApiProperty({ example: '+380522298472' })
  @IsAllowedPhoneNumber()
  @Transform(phoneNumberTransformer)
  readonly phoneNumber: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @NotContains(' ')
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'securepassword' })
  @NotContains(' ')
  @Length(8, 64)
  readonly password: string;
}
