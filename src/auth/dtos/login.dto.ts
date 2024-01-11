import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length, NotContains } from 'class-validator';
import { IsAllowedPhoneNumber } from '../validators/isAllowedPhoneNumber.validation';
import { phoneNumberTransformer } from '../transformers/phone-number.transformer';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ example: '+380522298472' })
  @IsOptional()
  @IsAllowedPhoneNumber()
  @Transform(phoneNumberTransformer)
  readonly phoneNumber?: string;

  @ApiProperty({ example: 'securepassword' })
  @NotContains(' ')
  @Length(8, 64)
  readonly password: string;
}
