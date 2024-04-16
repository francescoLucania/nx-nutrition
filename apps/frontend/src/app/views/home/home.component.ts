import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ButtonStandaloneComponent, InputStandaloneComponent } from 'ngx-neo-ui';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../../services';

type LoginForm = {
  login: AbstractControl<string>,
  password: AbstractControl<string>
}

@Component({
  selector: 'nutrition-home',
  standalone: true,
  imports: [
    InputStandaloneComponent,
    ButtonStandaloneComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  public form: FormGroup | undefined;

  constructor(private userService: UserService,) {
  }

  public ngOnInit() {
    this.form = new FormGroup<LoginForm>(    {
      login: new FormControl(),
      password: new FormControl()
    })
  }

  public auth() {
    const body = {
      login: this.form?.controls['login'].value,
      password: this.form?.controls['password'].value
    }
    this.userService.auth(body).subscribe(
      {next: (data: any) => {
        console.log('auth data')
        }}
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
