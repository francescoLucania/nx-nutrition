import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import * as colorette from 'colorette';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private accessToken: string | undefined;
  private _isLoggedIn$: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  private isRefreshing = false;

  public set setAccessToken(value: string) {
    this.accessToken = value;
  }

  public get isLoggedIn(): boolean | undefined {
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

  public refreshToken(): Observable<any> {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
    } else {
      this.isRefreshing = false;
      this._isLoggedIn$.next(false);
      return EMPTY;
    }

    return this.apiService.getRequest('user/refresh')
      .pipe(
        tap((response) => {
          this._isLoggedIn$.next(Boolean(response?.accessToken));
        }),
      );
  }

  public auth<Body>(body: Body): Observable<any> {
    return this.apiService.postRequest('user/login', body)
      .pipe(
        tap((response) => {
          this._isLoggedIn$.next(Boolean(response?.accessToken));
        }),
      );
  }

  public getUserData(): Observable<any> {
    return this.apiService.getRequest('user/getUserData');
  }
}
