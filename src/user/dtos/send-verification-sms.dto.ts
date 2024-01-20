import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { phoneNumberTransformer } from 'src/auth/transformers/phone-number.transformer';
import { IsAllowedPhoneNumber } from 'src/auth/validators/isAllowedPhoneNumber.validation';

export class SendVerificationSmsDto {
  @ApiProperty({ example: '+639123456789' })
  @IsAllowedPhoneNumber()
  @Transform(phoneNumberTransformer)
  phoneNumber: string;
}
