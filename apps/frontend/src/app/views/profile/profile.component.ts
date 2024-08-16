import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '../../services';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'nutrition-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  public userData$: Observable<any> | undefined
  constructor(private userService: UserService) {
  }

  public ngOnInit() {
    this.userData$ = this.userService.getUserData$()
  }
}
