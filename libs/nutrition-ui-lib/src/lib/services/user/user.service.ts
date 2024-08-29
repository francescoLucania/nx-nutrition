import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ApiService } from '../api/api.service';
import { BrowserService } from 'ngx-neo-ui';
import {
  CreateResponse,
  RegistrationBody,
  UserProfile,
} from '@nx-nutrition-models';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userProfileData$ = new BehaviorSubject<UserProfile | null>(null);
  public userProfileData$ = this._userProfileData$.asObservable();

  private set logoutUser(value: null) {
    this._userProfileData$.next(value);
  }

  constructor(
    private browserService: BrowserService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  public createUser$(body: RegistrationBody): Observable<CreateResponse> {
    return this.apiService.postRequest<RegistrationBody, CreateResponse>(
      'user/create',
      body
    );
  }

  public getUserData$(force = false): Observable<UserProfile | null> {
    if (force || !this._userProfileData$.getValue()) {
      this.authService.updateIsLoggedIn = 'processing';
      console.log('2', this._userProfileData$.getValue());
      return this.apiService.getRequest<UserProfile>('user/getUserData').pipe(
        catchError((err) => {
          this._userProfileData$?.next(null);
          return throwError(err);
        }),
        tap((response) => {
          this.authService.updateIsLoggedIn = 'done';
          this._userProfileData$?.next(response);
        })
      );
    }

    return this.userProfileData$;
  }

  public userLogout$(): Observable<any> {
    return this.authService.logout$().pipe(
      tap(() => {
        this.authService.updateIsLoggedIn = 'not';
        this.logoutUser = null;
      })
    );
  }
}
