import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, shareReplay, tap, } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { UserAuthState } from '../../models/user/user.modal';
import { BrowserService } from 'ngx-neo-ui';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private accessToken: string | undefined;
  private _isLoggedIn$: BehaviorSubject<UserAuthState> = new BehaviorSubject<UserAuthState>('processing');
  private isRefreshing = false;

  private _userProfileData$: Observable<any> | undefined;

  public set setAccessToken(value: string) {
    this.accessToken = value;
  }

  private set updateIsLoggedIn(value: UserAuthState) {
    setTimeout(() => {
      this._isLoggedIn$.next(value);
    }, 1000)
  }

  public get isLoggedIn(): UserAuthState {
    return this._isLoggedIn$.getValue();
  }

  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  public get getAccessToken(): string | undefined {
    return this.accessToken;
  }

  constructor(
    private browserService: BrowserService,
    private apiService: ApiService,
  ) { }

  public buildRequest(req: HttpRequest<any>): HttpRequest<any> {
    const setHeaders = this.getAccessToken ? {
      'Authorization': `Bearer ${this.getAccessToken}`,
    } : undefined;

    req = req.clone({
      withCredentials: true,
      setHeaders
    });

    return req;
  }

  public refreshToken$(): Observable<any> {

    if (!this.isRefreshing) {
      this.updateIsLoggedIn = 'processing';
      this.isRefreshing = true;
    } else {
      this.updateIsLoggedIn = 'not';
      this.isRefreshing = false;
      return EMPTY;
    }

    return this.apiService.getRequest('user/refresh')
      .pipe(
        tap(() => {
          this.updateIsLoggedIn = 'done';
        }),
      );
  }

  public auth$<Body>(body: Body): Observable<any> {
    return this.apiService.postRequest('user/login', body)
      .pipe(
        tap((response) => {
          this.updateIsLoggedIn = 'done';
        }),
      );
  }

  public getUserProfileData$(force = false): Observable<any> {

    if (force || !this._userProfileData$) {
      this.updateIsLoggedIn = 'processing';
      this._userProfileData$ = this.apiService.getRequest('user/getUserData').pipe(
        shareReplay(1),
      );
    }

    return this._userProfileData$ ? this._userProfileData$ : EMPTY;
  }
}
