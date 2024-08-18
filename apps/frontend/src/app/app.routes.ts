import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { userProfileGuard } from './guards/user/user-profile.guard';
import { RegistrationComponent } from './views/registration/registration.component';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'profile',
    canActivate: [userProfileGuard],
    loadChildren: () =>
      loadRemoteModule('frontend-profile', './routes').then((m) => m.appRoutes),
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
];
