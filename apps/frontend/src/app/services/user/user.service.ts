import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { UserAuthState } from '../../models/user/user.modal';
import { BrowserService } from 'ngx-neo-ui';
import { CreateResponse, RegistrationBody, UserProfile } from '@nx-nutrition-models';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userProfileData$: Observable<UserProfile> | undefined;

  private set logoutUser(value: Observable<UserProfile> | undefined) {
    this._userProfileData$ = undefined;
  }

  constructor(
    private browserService: BrowserService,
    private apiService: ApiService,
    private authService: AuthService,
  ) { }


  public createUser$(body: RegistrationBody): Observable<CreateResponse> {
    return this.apiService.postRequest<RegistrationBody, CreateResponse>('user/create', body);
  }

  public getUserData$(force = false): Observable<UserProfile> {
    if (force || !this._userProfileData$) {
      this.authService.updateIsLoggedIn = 'processing';
      this._userProfileData$ = this.apiService.getRequest<UserProfile>('user/getUserData').pipe(
        shareReplay(1),
      );
    }
    return this._userProfileData$
  }

  public userLogout$(): Observable<any> {
    return this.authService.logout$()
      .pipe(
        tap(() => {
          this.authService.updateIsLoggedIn = 'not';
          this.logoutUser = undefined;
        }),
    );
  }
}
