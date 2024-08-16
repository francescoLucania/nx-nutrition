import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, tap } from 'rxjs';
import { UserAuthState } from '../../models/user/user.modal';
import { UserProfile } from '@nx-nutrition-models';
import { BrowserService } from 'ngx-neo-ui';
import { ApiService } from '../api/api.service';
import { HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: string | undefined;
  private _isLoggedIn$: BehaviorSubject<UserAuthState> = new BehaviorSubject<UserAuthState>('processing');
  private isRefreshing = false;

  public set setAccessToken(value: string) {
    this.accessToken = value;
  }

  public set updateIsLoggedIn(value: UserAuthState) {
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
}
