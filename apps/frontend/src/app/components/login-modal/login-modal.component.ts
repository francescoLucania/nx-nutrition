import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, signal } from '@angular/core';
import {
  BrowserService,
  ButtonStandaloneComponent,
  DestroyService,
  InputStandaloneComponent,
  ModalService
} from 'ngx-neo-ui';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { UserService, ValidationService } from '../../services';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ThrobberComponent } from '../throbber/throbber.component';
import { LoginBody, LoginType } from '@nx-nutrition-models';
import { CommonFormControl, GetCommonFormControl } from '../../models/forms/form-control';

type LoginForm = Record<keyof Omit<LoginBody, 'loginType'>, CommonFormControl>

@Component({
  selector: 'nutrition-login-modal',
  standalone: true,
  imports: [
    ButtonStandaloneComponent,
    FormsModule,
    InputStandaloneComponent,
    NgIf,
    ReactiveFormsModule,
    ThrobberComponent,
    JsonPipe,
    RouterLink
  ],
  providers: [DestroyService],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: "true" },
})
export class LoginModalComponent implements OnInit {

  @Input() private route: string | undefined;

  public get login(): GetCommonFormControl {
    return this.form?.controls['login'] || null;
  }
  public get password(): GetCommonFormControl {
    return this.form?.controls['password'] || null;
  }

  public loading  = signal(true);
  public isBrowser = signal(false);
  public form: FormGroup<LoginForm> | undefined;

  constructor(
    private destroy$: DestroyService,
    private browserService: BrowserService,
    private userService: UserService,
    private modalService: ModalService,
    private validationService: ValidationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    ) {
  }

  public ngOnInit() {
    this.initState();
  }

  private initState(): void {
    this.isBrowser.set(this.browserService.isBrowser);
    this.userService.isLoggedIn$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        switch (value) {
          case 'processing':
            this.loading.set(true);
            break;
          case 'not':
            this.initForm();
            this.loading.set(false);
            break;
          case 'done':
            this.router.navigate([this.route]);
            this.modalService.close();
            break;
        }
        this.cdr.detectChanges()
      })
  }

  private initForm(): void {
    this.form = new FormGroup<LoginForm>( {
      login: new FormControl(null),
      password: new FormControl(null)
    });

    this.form?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      () => this.login?.setErrors({})
    )
  }

  public auth() {

    let userLogin;

    if (this.login) {
      userLogin = this.validationService.formatLogin(this.login);
    }

    if (userLogin) {

      if (!this.password?.value?.length) {
        this.password?.setErrors({
          error: 'Введите пароль'
        });
        this.cdr.detectChanges();
        return;
      }

      const body: LoginBody = <LoginBody> {
        login: userLogin?.login,
        loginType: userLogin?.idType,
        password: this.password?.value
      }

      this.userAuth$(body).pipe(
        finalize(() => this.cdr.detectChanges()),
        takeUntil(this.destroy$),
      )
        .subscribe(
          {
            next: () => !this.route ? this.modalService.close() : false,
            error: (error: HttpErrorResponse) => {
              if (error.error.message === 'USER_NOT_FOUND' || error.error.message === 'BAD_PASSWORD') {
                this.login?.setErrors({
                  error: 'Неправильный логин или пароль'
                })
              } else if (error.error.message === 'USER_NOT_ACTIVATED') {
                this.login?.setErrors({
                  error: 'Учетная запись не активирована, на указанной при регистрации почте должна быть ссылка для активации'
                })
              }
            }
          }
        )
    }
  }

  private userAuth$(
    body: LoginBody,
  ) {
    return this.userService.auth$(body)
  }

  public closeModal() {
    this.modalService.close()
  }
}
