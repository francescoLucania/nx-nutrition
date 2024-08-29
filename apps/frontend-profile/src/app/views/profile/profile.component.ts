import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '@nx-nutrition/nutrition-ui-lib';
import {
  ButtonStandaloneComponent,
  INavigateList,
  NavigateListComponent,
} from 'ngx-neo-ui';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'nutrition-profile',
  standalone: true,
  imports: [
    ButtonStandaloneComponent,
    JsonPipe,
    AsyncPipe,
    NgIf,
    NavigateListComponent,
    RouterOutlet,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  public profileMenu: INavigateList[] = [
    { name: 'Профиль', uri: '/profile' },
    { name: 'История заказов', uri: '/media-query' },
    { name: 'Документы', uri: '/typography' },
  ];

  constructor(private userService: UserService, private router: Router) {}

  public logout() {
    this.userService.userLogout$().subscribe({
      next: () => this.router.navigate(['']),
      error: () => console.error('Не удалось выйти'),
    });
  }
}
