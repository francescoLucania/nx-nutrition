import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonStandaloneComponent, DestroyService, InputStandaloneComponent, ModalService } from 'ngx-neo-ui';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../../services';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, takeUntil } from 'rxjs';

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
    ReactiveFormsModule
  ],
  providers: [DestroyService],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModalComponent implements OnInit {

  public get login(): AbstractControl | undefined {
    return this.form?.controls['login']
  }

  public form: FormGroup | undefined;

  constructor(
    private destroy$: DestroyService,
    private userService: UserService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
    ) {
  }

  public ngOnInit() {
    this.initForm();
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
    this.userService.auth(body)
      .pipe(
        finalize(() => this.cdr.detectChanges()),
        takeUntil(this.destroy$),
      )
      .subscribe(
      {
        next: (data: any) => this.modalService.close(),
        error: (error: HttpErrorResponse) => {
          if (error.error.message === 'USER_NOT_FOUND') {
            this.form?.controls['login'].setErrors({
              error: 'Неправильный логин или пароль'
            })
          }
        }
      }
    )
  }

  public getUserData() {
    return this.userService.getUserData().subscribe(
      {next: (data: any) => {
          console.log('getUserData data')
        }}
    )
  }
}
