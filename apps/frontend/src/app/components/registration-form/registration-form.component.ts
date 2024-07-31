import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services';
import { takeUntil } from 'rxjs';
import {
  BrowserService, ButtonStandaloneComponent,
  DestroyService,
  InputStandaloneComponent,
  ModalService,
  RadioStandaloneComponent
} from 'ngx-neo-ui';
import { RegistrationBody } from '@nx-nutrition-models';
import { Router } from '@angular/router';
import { ThrobberComponent } from '../throbber/throbber.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { MASKITO_DEFAULT_OPTIONS, MaskitoOptions } from '@maskito/core';
import { maskitoPhoneOptionsGenerator } from '@maskito/phone';

type RegistrationForm = Record<keyof RegistrationBody, FormControl<string>>

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
    ButtonStandaloneComponent
  ],
  providers: [
    DestroyService
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationFormComponent implements OnInit {

  public get email(): FormControl<string> | undefined {
    return this.form?.controls['email'];
  }
  public get phone(): FormControl<string> | undefined {
    return this.form?.controls['phone'];
  }
  public get name(): FormControl<string> | undefined {
    return this.form?.controls['name'];
  }
  public get fullName(): FormControl<string> | undefined {
    return this.form?.controls['fullName'];
  }
  public get dateIssue(): FormControl<string> | undefined {
    return this.form?.controls['dateIssue'];
  }
  public get password(): FormControl<string> | undefined {
    return this.form?.controls['password'];
  }

  public isBrowser = false;

  public state: WritableSignal<
    'processing' |
    'registration-form' |
    'password-form' |
    'complete-view'
  > = signal('registration-form');

  public form: FormGroup<RegistrationForm> | undefined;
  public phoneMask: MaskitoOptions = MASKITO_DEFAULT_OPTIONS

  constructor(
    private userService: UserService,
    private browserService: BrowserService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: ModalService,
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

  private async initForm(): Promise<void> {

    this.form = new FormGroup<RegistrationForm>({
      email: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      fullName: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      gender: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      dateIssue: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),

    });

    this.phoneMask = maskitoPhoneOptionsGenerator({
      countryIsoCode: 'RU',
      metadata: await import('libphonenumber-js/min/metadata').then(
        (m) => m.default
      ),
    });
  }
}
