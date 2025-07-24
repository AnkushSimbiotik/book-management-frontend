import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNoLeadingSpace]',
  standalone: true,
})
export class NoLeadingSpaceDirective {
  constructor(private control: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (event.key === ' ' && input.selectionStart === 0) {
      event.preventDefault();
      if (this.control.control) {
        this.control.control.setErrors({ leadingSpace: 'Input cannot start with a space' });
        this.control.control.markAsTouched();
        this.control.control.markAsDirty();
      }
    } else {
      // Clear leadingSpace error if input is valid
      if (this.control.control && input.value && !input.value.startsWith(' ')) {
        const errors = this.control.control.errors;
        if (errors && errors['leadingSpace']) {
          delete errors['leadingSpace'];
          this.control.control.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    if (pastedText.startsWith(' ')) {
      event.preventDefault();
      if (this.control.control) {
        this.control.control.setErrors({ leadingSpace: 'Input cannot start with a space' } , { emitEvent: false});
        this.control.control.markAsTouched();
        this.control.control.markAsDirty();
      }
    }
  }

  // CHANGE: Added input event handler to block spaces
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.startsWith(' ')) {
      input.value = ''; // Clear input to prevent spaces
      if (this.control.control) {
        this.control.control.setValue('');
        this.control.control.setErrors({ leadingSpace: 'Input cannot start with a space' });
        this.control.control.markAsTouched();
        this.control.control.markAsDirty();
      }
    } else if (this.control.control) {
      // Update control value and clear leadingSpace error if valid
      this.control.control.setValue(input.value, { emitEvent: false });
      const errors = this.control.control.errors;
      if (errors && errors['leadingSpace']) {
        delete errors['leadingSpace'];
        this.control.control.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }
}