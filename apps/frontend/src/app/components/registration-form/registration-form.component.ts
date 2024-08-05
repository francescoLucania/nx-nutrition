import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, effect,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { LoginTypes, UserService, ValidationService } from '../../services';
import { Observable, takeUntil } from 'rxjs';
import {
  BrowserService, ButtonStandaloneComponent,
  DestroyService,
  InputStandaloneComponent,
  ModalService,
  RadioStandaloneComponent,
} from 'ngx-neo-ui';
import { RegistrationBody, RegistrationError, RegistrationErrors } from '@nx-nutrition-models';
import { Router } from '@angular/router';
import { ThrobberComponent } from '../throbber/throbber.component';
import { JsonPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { MASKITO_DEFAULT_OPTIONS, MaskitoOptions } from '@maskito/core';
import { maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { maskitoDateOptionsGenerator } from '@maskito/kit';
import { CommonFormControl, GetCommonFormControl } from '../../models/forms/form-control';
import { BaseInputComponent } from '../base-input/base-input.component';
import { matchValidator } from '../../validators';

type RegistrationForm = Record<keyof RegistrationBody, CommonFormControl>;
type PasswordForm = {
  password: CommonFormControl,
  replayPassword: CommonFormControl,
};

@Component({
  selector: 'nutrition-registration-form',
  standalone: true,
  imports: [
    ThrobberComponent,
    NgTemplateOutlet,
    ReactiveFormsModule,
    NgIf,
    InputStandaloneComponent,
    RadioStandaloneComponent,
    ButtonStandaloneComponent,
    BaseInputComponent,
    JsonPipe
  ],
  providers: [
    DestroyService
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationFormComponent implements OnInit {

  public get email(): GetCommonFormControl {
    return this.registrationForm?.controls['email'] || null;
  }
  public get phone(): GetCommonFormControl {
    return this.registrationForm?.controls['phone'] || null;
  }
  public get name(): GetCommonFormControl {
    return this.registrationForm?.controls['name'] || null;
  }
  public get fullName(): GetCommonFormControl {
    return this.registrationForm?.controls['fullName'] || null;
  }
  public get dateIssue(): GetCommonFormControl {
    return this.registrationForm?.controls['dateIssue'] || null;
  }
  public get gender(): GetCommonFormControl {
    return this.registrationForm?.controls['gender'] || null;
  }
  public get password(): GetCommonFormControl {
    return this.passwordForm?.controls['password'] || null;
  }

  public get replayPassword(): GetCommonFormControl {
    return this.passwordForm?.controls['replayPassword'] || null;
  }

  public isBrowser = false;

  public state: WritableSignal<
    'processing' |
    'registration-form' |
    'password-form' |
    'complete-view'
  > = signal('registration-form');

  public registrationForm: FormGroup<RegistrationForm> | undefined;
  public passwordForm: FormGroup<PasswordForm> | undefined;
  public phoneMask: MaskitoOptions = MASKITO_DEFAULT_OPTIONS;
  public dateMask: MaskitoOptions = MASKITO_DEFAULT_OPTIONS;

  private errorMessages = {
    email: 'Введите email',
    phone: 'Введите телефон',
    name: 'Введите имя',
    fullName: 'Введите ФИО',
    dateIssue: 'Введите дату рождения',
    gender: 'Обязательное поле',
  }

  constructor(
    private userService: UserService,
    private browserService: BrowserService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: ModalService,
    private validationService: ValidationService,
    private router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.modalService.close();
    this.initState();
  }

  private initState(): void {
    this.isBrowser = this.browserService.isBrowser;
    this.userService.isLoggedIn$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        switch (value) {
          case 'processing':
            this.state.set('processing');
            break;
          case 'not':
            this.state.set('registration-form');
            this.initForm();
            break;
          case 'done':
            this.router.navigate(['']);
            this.modalService.close();
            break;
        }
        this.cdr.detectChanges()
      })
  }

  private initForm(): void {

    this.registrationForm = new FormGroup<RegistrationForm>({
      email: new FormControl(null),
      phone: new FormControl(null),
      name: new FormControl(null),
      fullName: new FormControl(null),
      gender: new FormControl(null),
      dateIssue: new FormControl(null),
      password: new FormControl(null),
    });

    this.passwordForm = new FormGroup<PasswordForm>({
      password: new FormControl(null),
      replayPassword: new FormControl(null),
    },
      {
        validators: matchValidator(
          'password',
          'replayPassword'
        )
      }
      );

    this.initMask();
  }

  private async initMask(): Promise<void> {
    this.phoneMask = maskitoPhoneOptionsGenerator({
      countryIsoCode: 'RU',
      metadata: await import('libphonenumber-js/min/metadata').then(
        (m) => m.default
      ),
    });

    this.dateMask = maskitoDateOptionsGenerator({
      mode: 'dd/mm/yyyy',
      min: new Date(1940, 0, 1),
      max: new Date(new Date().getFullYear() - 18, 4, 10),
    });
  }

  public continue() {
    const validationValues = this.validateRegistrationForm();
    const errorsFields = [...validationValues.entries()]
      .filter(item => !item[1]);

    if (!errorsFields.length) {
      this.state.set('password-form');
    } else {
      for (const error of errorsFields) {
        const fieldName = error[0];

        this.setErrorsRegistrationForm(fieldName, {
          error: this.errorMessages[fieldName]
        })
      }

      this.cdr.detectChanges();
    }
  }

  private validateRegistrationForm(): Map<Exclude<keyof RegistrationForm, 'password'>, boolean> {
    const values = new Map();

    values.set('email', this.email && this.validateContact(this.email, 'email'));
    values.set('phone', this.email && this.validateContact(this.phone, 'phone'));
    values.set('name', this.validationTextField(this.name));
    values.set('fullName', this.validationTextField(this.fullName));
    values.set('dateIssue', this.validationTextField(this.dateIssue));
    values.set('gender', this.validationTextField(this.gender));

    return values;
  }

  private validationTextField(value: GetCommonFormControl): boolean {
    if (value) {
      return Boolean(value?.value);
    }

    return false;
  }

  private validateContact(contact: GetCommonFormControl, type: LoginTypes): boolean {
    if (contact) {
      const result = this.validationService.formatLogin(contact, [type])
      return result ? result.idType === type : false;
    }
    return false;
  }

  public registration() {
    this.setPasswordFormRegistration();

    if (this.registrationForm?.valid) {
      this.registration$().pipe(
        takeUntil(this.destroy$),
      )
        .subscribe({
          next: (data) => {
            console.log('data', data);
          },
          error: (error: RegistrationError) => {

            if (error.error.message === RegistrationErrors.BusyEmail) {
              this.state.set('registration-form');

              this.cdr.detectChanges();
              this.setErrorsRegistrationForm('email',
                {
                error: 'Пользователь c такой почтой уже существует',
                })
            }

            if (error.error.message === RegistrationErrors.BusyPhone) {
              this.state.set('registration-form');

              this.cdr.detectChanges();
              this.setErrorsRegistrationForm('phone',
                {
                  error: 'Пользователь c таким номером телефона уже существует',
                })
            }
          }
    })
    }
  }

  private setPasswordFormRegistration() {
    if (this.passwordForm?.valid) {
      const password = this.password?.value

      if (typeof password === 'string') {
        this.getControlRegistrationForm('password')?.setValue(
          password
        )
      }
    }
  }

  private registration$(): Observable<any> {
    const body = <RegistrationBody>{...this.registrationForm?.value};
    return this.userService.createUser$(body);
  }

  private setErrorsRegistrationForm(name: keyof RegistrationForm, errors: ValidationErrors): void {
    this.getControlRegistrationForm(name)?.setErrors(errors);
  }

  public getControlRegistrationForm(name: keyof RegistrationForm): GetCommonFormControl {
    return this.registrationForm?.controls[name] || null;
  }
}
