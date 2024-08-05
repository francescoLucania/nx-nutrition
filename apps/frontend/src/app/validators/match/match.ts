import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export type MatchValidator = ValidationErrors & {notMatch?: true}

export function matchValidator<FormType>(
  controlName: string,
  matchingControlName: string,): ValidatorFn
{
  return (formGroup: AbstractControl<FormType>): MatchValidator => {
    const control = formGroup?.get(controlName)?.value;
    const matchingControl = formGroup?.get(matchingControlName)?.value;

    if (control && matchingControl) {
      return control === matchingControl ? {} : { notMatch: true };
    }

    return { notMatch: true }
  };
}
