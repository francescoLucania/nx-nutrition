import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional, signal,
  SkipSelf, WritableSignal
} from '@angular/core';
import { MaskitoOptions } from '@maskito/core';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import {
  ControlContainer,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule, ValidationErrors
} from '@angular/forms';
import { InputStandaloneComponent } from 'ngx-neo-ui';

@Component({
  selector: 'nutrition-base-input',
  standalone: true,
  imports: [
    NgIf,
    InputStandaloneComponent,
    JsonPipe,
    ReactiveFormsModule,
    KeyValuePipe,
    NgForOf
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseInputComponent),
      multi: true,
    },
  ],
  templateUrl: './base-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseInputComponent implements ControlValueAccessor, OnInit {

  @Input() public size: 'small' | 'base' | 'large' = 'large';
  @Input() public label: string | undefined = undefined;
  @Input() public value: string | undefined = undefined;
  @Input() public autocomplete = false;
  @Input() public formControlName = '';
  @Input() public placeholder: string | undefined = undefined;
  @Input() public ariaLabel: string | undefined = undefined;
  @Input() public name: string | undefined = undefined;
  @Input() public maskitoOptions?: MaskitoOptions = undefined;
  @Input() public type = 'text';

  @Input() public set setError(value: ValidationErrors | null | undefined) {
    this.error.set(value);
  }

  public error: WritableSignal<ValidationErrors | null | undefined> = signal(undefined);
  public control = this.controlContainer?.control?.get(this.formControlName);

  private onChange: (value: unknown) => void = () => null;
  private onTouch: (value: unknown) => void = () => null;

  constructor(
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer
  ) {}

  ngOnInit() {

    if (this.controlContainer && this.formControlName) {
      this.control = this.controlContainer?.control?.get(this.formControlName)
        ? this.controlContainer?.control?.get(this.formControlName)
        : null;
    } else {
      this.control = null;
    }
  }

  public writeValue(value: any) {
  }
  public registerOnTouched(fn: (value: unknown) => void) {
    this.onTouch = fn
  }
  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }
}
