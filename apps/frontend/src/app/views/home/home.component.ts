import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ButtonStandaloneComponent, InputStandaloneComponent } from 'ngx-neo-ui';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../../services';
import { RouterLink } from '@angular/router';

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
    NgIf,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
