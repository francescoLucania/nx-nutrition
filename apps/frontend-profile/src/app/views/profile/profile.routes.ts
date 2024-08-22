import { Route } from '@angular/router';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';

export const profileRoutes: Route[] = [
  {
    path: '',
    component: ProfileViewComponent,
  },
];
