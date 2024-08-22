import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: async () =>
      (await import('./views/profile/profile.component'))
        .ProfileComponent,
    loadChildren: async () =>
      (await import('./views/profile/profile.routes')).profileRoutes,
  },
];
