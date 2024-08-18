import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './interceptors';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthService, CONFIG, ConfigService, UserService } from '@nx-nutrition/nutrition-ui-lib';
import { environment } from './environments/environment';

export function initializerFactory(userService: UserService) {
  return () => userService.getUserData$().subscribe();
}


export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: CONFIG,
      useValue: {
        production: environment.production,
        apiUrl: environment.apiUrl,
      },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFactory,
      deps: [UserService],
      multi: true
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
      ])
    ),
    provideClientHydration(),
    provideRouter(appRoutes)],
};
