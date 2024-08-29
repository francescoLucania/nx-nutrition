import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegistrationFormComponent } from '../../components/registration-form/registration-form.component';

@Component({
  selector: 'nutrition-registration',
  standalone: true,
  imports: [RegistrationFormComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
})
export class RegistrationComponent {}
