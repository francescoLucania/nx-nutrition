import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './interceptors';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserService } from './services';

export function initializerFactory(userService: UserService) {
  return () => userService.getUserData().subscribe();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
      ])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFactory,
      deps: [UserService],
      multi: true
    },
    provideClientHydration(),
    provideRouter(appRoutes)],
};
