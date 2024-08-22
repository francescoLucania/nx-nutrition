import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'nutrition-icon',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {

  public name = input<string>();
  public class = input<string>();
  public fill = input<string>();
  public path = signal('assets/images/icons/icons.svg#');
}
