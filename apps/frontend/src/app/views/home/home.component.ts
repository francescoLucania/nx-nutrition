import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonStandaloneComponent, InputStandaloneComponent } from 'ngx-neo-ui';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

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
