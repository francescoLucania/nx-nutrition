import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ButtonStandaloneComponent, DestroyService, InputStandaloneComponent, ModalService } from 'ngx-neo-ui';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../../services';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ThrobberComponent } from '../throbber/throbber.component';

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
    ThrobberComponent
  ],
  providers: [DestroyService],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModalComponent implements OnInit {

  @Input() private route: string | undefined;

  public get login(): AbstractControl | undefined {
    return this.form?.controls['login']
  }

  public loading = true;
  public form: FormGroup | undefined;

  constructor(
    private destroy$: DestroyService,
    private userService: UserService,
    private modalService: ModalService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    ) {
  }

  public ngOnInit() {
    this.initState();
  }

  private initState(): void {
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
            this.router.navigate([this.route]);
            this.modalService.close();
        }
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
    const body = {
      login: this.form?.controls['login'].value,
      password: this.form?.controls['password'].value
    }
    this.userService.auth$(body)
      .pipe(
        finalize(() => this.cdr.detectChanges()),
        takeUntil(this.destroy$),
      )
      .subscribe(
      {
        next: () => this.modalService.close(),
        error: (error: HttpErrorResponse) => {
          if (error.error.message === 'USER_NOT_FOUND' || error.error.message === 'BAD_PASSWORD') {
            this.form?.controls['login'].setErrors({
              error: 'Неправильный логин или пароль'
            })
          }
        }
      }
    )
  }
}
