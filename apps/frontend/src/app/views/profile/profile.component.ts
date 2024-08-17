import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService, UserService } from '../../services';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { response } from 'express';
import { ButtonStandaloneComponent } from 'ngx-neo-ui';
import { Router } from '@angular/router';

@Component({
  selector: 'nutrition-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgIf,
    ButtonStandaloneComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  public userData$: Observable<any> | undefined
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
