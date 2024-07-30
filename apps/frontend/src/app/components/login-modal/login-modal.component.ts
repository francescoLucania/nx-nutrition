import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  BrowserService,
  ButtonStandaloneComponent,
  DestroyService,
  InputStandaloneComponent,
  ModalService
} from 'ngx-neo-ui';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { LoginTypes, UserService, ValidationService } from '../../services';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ThrobberComponent } from '../throbber/throbber.component';
import { LoginType } from '@nx-nutrition-models';

class LoginForm {
}

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

  public get login(): AbstractControl | undefined {
    return this.form?.controls['login']
  }
  public get password(): AbstractControl | undefined {
    return this.form?.controls['password']
  }

  public loading = true;
  public isBrowser = false;
  public form: FormGroup | undefined;
  public userLogin: { idType: LoginType; login: string } | boolean = false;

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
    this.isBrowser = this.browserService.isBrowser;
    this.userService.isLoggedIn$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        switch (value) {
          case 'processing':
            this.loading = true;
            break;
          case 'not':
            this.initForm();
            this.loading = false;
            break;
          case 'done':
            console.log('this.route', this.route);
            this.router.navigate([this.route]);
            this.modalService.close();
            break;
        }
        this.cdr.detectChanges()
      })
  }

  private initForm(): void {
    this.form = new FormGroup<LoginForm>(    {
      login: new FormControl(),
      password: new FormControl()
    })
    this.form?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      () => this.login?.setErrors({})
    )
  }

  public auth() {
    this.userLogin = this.validationService.formatLogin(this.login);

    if (typeof this.userLogin !== 'boolean') {

      if (!this.password?.value?.length) {
        this.password?.setErrors({
          error: 'Введите пароль'
        });
        this.cdr.detectChanges();
        return;
      }

      const body = {
        login: this.userLogin?.login,
        loginType: this.userLogin?.idType,
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
    body: {
    login: string;
    password: string
  }
  ) {
    return this.userService.auth$(body)
  }
}
