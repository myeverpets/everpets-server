import { BadRequestException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function phoneNumberTransformer({
  value,
}: TransformFnParams): string | undefined {
  const phoneNumber = parsePhoneNumberFromString(value);
  if (phoneNumber) {
    return phoneNumber.format('E.164');
  } else {
    throw new BadRequestException(
      'Invalid phone number. Valid format: [+] [country code] [subscriber number including area code]',
    );
  }
}
