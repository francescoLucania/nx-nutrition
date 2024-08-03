import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginTypes, UserService, ValidationService } from '../../services';
import { takeUntil } from 'rxjs';
import {
  BrowserService, ButtonStandaloneComponent,
  DestroyService,
  InputStandaloneComponent,
  ModalService,
  RadioStandaloneComponent,
} from 'ngx-neo-ui';
import { RegistrationBody } from '@nx-nutrition-models';
import { Router } from '@angular/router';
import { ThrobberComponent } from '../throbber/throbber.component';
import { JsonPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { MASKITO_DEFAULT_OPTIONS, MaskitoOptions } from '@maskito/core';
import { maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { maskitoDateOptionsGenerator } from '@maskito/kit';
import { CommonFormControl, GetCommonFormControl } from '../../models/forms/form-control';
import { BaseInputComponent } from '../base-input/base-input.component';

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
    return this.form?.controls['email'] || null;
  }
  public get phone(): GetCommonFormControl {
    return this.form?.controls['phone'] || null;
  }
  public get name(): GetCommonFormControl {
    return this.form?.controls['name'] || null;
  }
  public get fullName(): GetCommonFormControl {
    return this.form?.controls['fullName'] || null;
  }
  public get dateIssue(): GetCommonFormControl {
    return this.form?.controls['dateIssue'] || null;
  }
  public get gender(): GetCommonFormControl {
    return this.form?.controls['gender'] || null;
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

  public form: FormGroup<RegistrationForm> | undefined;
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
            this.initForm()
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

    this.form = new FormGroup<RegistrationForm>({
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
    });

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
        const fieldName = error[0]
        this.getControl(fieldName)?.setErrors({error: this.errorMessages[fieldName]})
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

  // private validateValues(value, type): void {
  //   email
  //   phone
  //   name
  //   fullName
  //   dateIssue
  // }
  public getControl(name: keyof RegistrationForm): GetCommonFormControl {
    return this.form?.controls[name] || null;
  }
}
