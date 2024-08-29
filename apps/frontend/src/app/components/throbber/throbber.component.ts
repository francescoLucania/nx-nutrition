import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'nutrition-throbber',
  standalone: true,
  imports: [],
  templateUrl: './throbber.component.html',
  styleUrl: './throbber.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThrobberComponent {}
