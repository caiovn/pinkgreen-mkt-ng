import { Directive } from '@angular/core';
import {
  FormControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appCreditcardValidatorDirective]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CreditcardValidatorDirectiveDirective,
      multi: true,
    },
  ],
})
export class CreditcardValidatorDirectiveDirective implements Validator {
  validate(c: FormControl): ValidationErrors | null {
    return CreditcardValidatorDirectiveDirective.validateCcNumber(c);
  }

  static validateCcNumber(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    if (
      !(
        value.startsWith('37') ||
        value.startsWith('4') ||
        value.startsWith('5')
      )
    ) {
      // Return error if card is not Amex, Visa or Mastercard
      return {
        creditCard:
          'Your credit card number is not from a supported credit card provider',
      };
    } else if (value.length !== 16) {
      console.log(value);
      // Return error if length is not 16 digits
      return { creditCard: 'A credit card number must be 16-digit long' };
    }
    // If no error, return null
    return null;
  }
}
