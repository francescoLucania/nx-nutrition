import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ProfileComponent } from './views/profile/profile.component';
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
    component: ProfileComponent,
    canActivate: [userProfileGuard],
  },
  {
    path: 'profile-1',
    loadComponent: () =>
      loadRemoteModule('frontend-profile', './Component').then((m) => m.AppComponent),
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
];
