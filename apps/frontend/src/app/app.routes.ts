import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
];
