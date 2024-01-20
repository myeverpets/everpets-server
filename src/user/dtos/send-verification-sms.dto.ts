import { Transform } from 'class-transformer';
import { phoneNumberTransformer } from 'src/auth/transformers/phone-number.transformer';
import { IsAllowedPhoneNumber } from 'src/auth/validators/isAllowedPhoneNumber.validation';

export class SendVerificationSmsDto {
  @IsAllowedPhoneNumber()
  @Transform(phoneNumberTransformer)
  phoneNumber: string;
}
