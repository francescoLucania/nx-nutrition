import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@nx-nutrition/nutrition-ui-lib';
import { ButtonStandaloneComponent } from 'ngx-neo-ui';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { UserProfile } from '@nx-nutrition-models';

@Component({
  selector: 'nutrition-profile',
  standalone: true,
  imports: [
    ButtonStandaloneComponent,
    JsonPipe,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  public userData$: Observable<UserProfile | null> | undefined
  constructor(
    private userService: UserService,
    private router: Router,
  ) {
  }

  public ngOnInit() {
    this.userData$ = this.userService.getUserData$()
  }

  public logout() {
    this.userService.userLogout$().subscribe({
      next: () => this.router.navigate(['']),
      error: () => console.error('Не удалось выйти')
    });
  }
}
