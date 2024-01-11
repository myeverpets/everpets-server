import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsAllowedPhoneNumberConstraints
  implements ValidatorConstraintInterface
{
  private errorMessage: string = '';
  validate(value: any): boolean {
    const phoneNumber = parsePhoneNumberFromString(value);
    if (!phoneNumber || !phoneNumber.isValid()) {
      this.errorMessage =
        'Invalid phone number. Valid format: [+] [country code] [subscriber number including area code]';
      return false;
    }
    if (phoneNumber.country === 'RU') {
      this.errorMessage =
        'The phone number is not allowed for Russia (RU). STOP WAR!';
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    return this.errorMessage || 'Invalid phone number';
  }
}

export function IsAllowedPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsAllowedPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAllowedPhoneNumberConstraints,
    });
  };
}
