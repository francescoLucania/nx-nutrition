import { Route } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ProfileComponent } from './views/profile/profile.component';
import { userProfileGuard } from './guards/user/user-profile.guard';
import { RegistrationComponent } from './views/registration/registration.component';

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
    path: 'registration',
    component: RegistrationComponent,
  },
];
