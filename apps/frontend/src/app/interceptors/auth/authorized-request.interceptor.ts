import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../../services';
import { catchError, switchMap, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService)
  return next(userService.buildRequest(req))
    .pipe(
      catchError((error)=> {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('user/login') &&
          error.status === 401
        ) {
          console.log('error!!!!!!!!!!', error)
          return userService.refreshToken().pipe(
            switchMap(() => {
              return next(userService.buildRequest(req));
            }),
          );
        }

        return throwError(() => error);
      }),
      tap((response: any) => {
        const accessToken = response?.body?.accessToken
        if (accessToken) {
          console.log('set accessToken', accessToken)
          userService.setAccessToken = accessToken;
        }
        console.log('response', response)
      })
    );
};
