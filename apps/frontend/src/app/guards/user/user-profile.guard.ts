import { CanActivateFn } from '@angular/router';
import { UserService } from '../../services';
import { inject } from '@angular/core';
import { ModalService } from 'ngx-neo-ui';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';

export const userProfileGuard: CanActivateFn = (route, state) => {
  const userService: UserService = inject(UserService);
  const modalService: ModalService = inject(ModalService);

  if (userService.isLoggedIn === 'done') {
    return true;
  } else {
    console.log('route', route);
    modalService.open(LoginModalComponent, undefined, {
      route: route?.routeConfig?.path
    });
  }
  return false;

};
