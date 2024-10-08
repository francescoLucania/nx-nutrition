import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthService, UserService } from '@nx-nutrition/nutrition-ui-lib';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  return next(authService.buildRequest(req)).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        !req.url.includes('user/login') &&
        error.status === 401
      ) {
        return authService.refreshToken$().pipe(
          switchMap(() => {
            return next(authService.buildRequest(req));
          })
        );
      }
      return throwError(() => error);
    }),
    tap((response: any) => {
      const accessToken = response?.body?.accessToken;
      if (accessToken) {
        authService.setAccessToken = accessToken;
      }
    })
  );
};
