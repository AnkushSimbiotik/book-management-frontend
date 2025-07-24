import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noLeadingSpaceValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value === 'string' && value.startsWith(' ')) {
      return { leadingSpace: 'Input cannot start with a space' };
    }
    return null;
  };
}