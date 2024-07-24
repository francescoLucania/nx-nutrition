import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, shareReplay, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import * as colorette from 'colorette';
import { UserAuthState } from '../../models/user/user.modal';

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

  public get isLoggedIn(): UserAuthState {
    return this._isLoggedIn$.getValue();
  }

  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  public get getAccessToken(): string | undefined {
    return this.accessToken;
  }

  constructor(
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
    console.log('refresh')
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this._isLoggedIn$.next('processing');
    } else {
      this.isRefreshing = false;
      return EMPTY;
    }

    this._isLoggedIn$.next('processing');
    return this.apiService.getRequest('user/refresh')
      .pipe(
        tap(() => {
          this._isLoggedIn$.next('done');
        }),
      );
  }

  public auth$<Body>(body: Body): Observable<any> {
    return this.apiService.postRequest('user/login', body)
      .pipe(
        tap((response) => {
          this._isLoggedIn$.next('done');
        }),
      );
  }

  public getUserProfileData$(force = false): Observable<any> {
    if (force || !this._userProfileData$) {
      this._isLoggedIn$.next('processing');
      this._userProfileData$ = this.apiService.getRequest('user/getUserData').pipe(
        shareReplay(1),
      );
    }

    return this._userProfileData$ ? this._userProfileData$ : EMPTY;
  }
}
